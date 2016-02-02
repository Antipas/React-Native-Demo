'use strict';

var React = require('react-native');
var {
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    PanResponder,
    Dimensions,
    ScrollView,
    ToastAndroid,
    ProgressBarAndroid,
} = React
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';
import * as socketActions from '../actions/SocketActions';

var api = require("../Contants");
var TimerMixin = require('react-timer-mixin');
var { NativeModules } = require('react-native');
var Notification = NativeModules.NotificationAndroid;
var deviceWidth = Dimensions.get('window').width;

var MIN_PULLDOWN_DISTANCE = 20;
var SCROLL_HEIGHT = 80;
var SCROLL_EVENT_THROTTLE =100;
var SCROLL_ACC = 5;
var ONCE_TAKE_NUM = 20;
var NO_MORE = 11;
var since_id;

function mapStateToProps(state) {
  return {
      ...state
  };
}

const actions = [
  socketActions
];

function mapDispatchToProps(dispatch) {
  const creators = Map()
          .merge(...actions)
          .filter(value => typeof value === 'function')
          .toObject();

  return {
      actions: bindActionCreators(creators, dispatch),
      dispatch
  };
}

var MessageList = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        return {
            refreshing: false,
            scrollY: 0,
            touching: false,
            ignoreInertialScroll:true,
            refreshState : '',
            dataSource: dataSource
            };
        },
        setRows(rows) { 
            this._rows = rows; 
        },
        getRows() { 
            return this._rows; 
        },
        getDefaultProps() {
            return {
                minPulldownDistance: MIN_PULLDOWN_DISTANCE,
                scrollEventThrottle: SCROLL_EVENT_THROTTLE,
                ignoreInertialScroll: true,
            }
        },
    componentDidMount: function() {
        this.scrollToBottom(10);
      },
    componentWillMount: function() {
        var that = this;
        this._panResponder = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: (evt, gestureState) => {
            return !that.state.refreshing;
            },
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
            this.setState({touching: true});
            },

            onPanResponderMove: (evt, gestureState) => {

                if(that.scrollY > 0 || that.state.refreshing || since_id === NO_MORE) {
                    return ;
                }
                var dy = that.dy = gestureState.dy * SCROLL_ACC;
                if(dy > MIN_PULLDOWN_DISTANCE && that.state.touching && !that.state.refreshing) {
                    that.setState({scrollY:dy});
                    that.fetchMessage();
                    that.onRefresh(dy);
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderEnd: (evt, gestureState) => {
                that.onRelease();
                that.setState({touching: false});
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                return true;
            },
        });
    },
    componentWillReceiveProps: function(nextProps){
        var that = this;
        //join a room then load message
        const {resRoom} = this.props.room;
        if(resRoom !== nextProps.room.resRoom){
            if(nextProps.room.resRoom){
                // clear data
                if(this.getRows()){
                    this.setRows([]);
                    since_id = null;
                    this.getDataSource([]);
                }

                this.fetchMessage(nextProps.room.resRoom);
            }
        }

        const {messages,newMessage} = this.props.message;
        if(messages !== nextProps.message.messages){
            if(nextProps.message.messages){
                var messagesList = nextProps.message.messages.reverse();
                if(that.state.dataSource.getRowCount() === 0){
                    that.setRows(messagesList);
                    that.setState({
                         dataSource: that.getDataSource(that.getRows()),
                         refreshing: false
                    });
                    since_id = messagesList[0].id;
                }else if(messagesList.length === 0){
                    ToastAndroid.show('No more data', ToastAndroid.SHORT);
                    since_id = NO_MORE;
                }else{
                    that.setRows(messagesList.concat(that.getRows()));

                    that.setState({
                         dataSource: that.getDataSource(that.getRows()),
                         refreshing: false
                    });
                    since_id = messagesList[0].id;
                }

               
               var hander  = setInterval(()=>{
                   if(that.state.scrollY - 50 > 0 ){
                      that.setState({scrollY:that.state.scrollY-50})
                   } else {
                       clearInterval(hander);
                       that.setState({scrollY:0})
                   }
               },20);
            }
        }else if(newMessage !== nextProps.message.newMessage){
            if(nextProps.message.newMessage){
                this.addMessage(nextProps.message.newMessage);
                Notification.show(nextProps.message.newMessage);
            }
        }

    },
    _handlePanResponderGrant: function(e: Object, gestureState: Object) {
        return true;
    },
    _handlePanResponderMove: function(e: Object, gestureState: Object) {
        return true;
    },
    onRelease () {
        var dy = this.dy ;
        var hander ;
        if(this.state.refreshing && this.dy > 3 && dy < SCROLL_HEIGHT) {
            hander = setInterval(()=>{
                if(dy + 20 < SCROLL_HEIGHT){
                    dy = dy + 20;
                    this.setState({scrollY: dy});
                }else{
                    this.dy = SCROLL_HEIGHT ;
                    clearInterval(hander);
                    this.setState({scrollY:SCROLL_HEIGHT});
                }
            },30);
        }
    },
    onRefresh (dy) {
        this.setState({scrollY:dy > SCROLL_HEIGHT ? SCROLL_HEIGHT: dy});
    },
    listViewScroll (e) {
        this.scrollY =  e.nativeEvent.contentOffset.y;
    },
    renderIndicator () {
        return(
            <View  style={[styles.indicator,{height: this.state.scrollY}]}>
                   <ProgressBarAndroid styleAttr="Inverse" />
            </View>
        )
    },
    addMessage: function(message){
        var that = this;
        this.setRows(this.getRows().concat(message));
        this.setState({
             dataSource: that.getDataSource(that.getRows()),
             refreshing: false
        });    
        this.scrollToBottom(1);
    },
    scrollToBottom: function(time){
        var that = this;
        var hander  = setTimeout(()=>{
            var metrics = that.listview.getMetrics();
            var height = metrics.contentLength/ONCE_TAKE_NUM + metrics.contentLength;
            that.scrollview.getScrollResponder().scrollTo(height,0);
         },time);
    },
    fetchMessage: function(resRoom){
        var id =  resRoom ? resRoom.id :
            this.props.room.resRoom ? this.props.room.resRoom.id :
            null;
        if(!id){
            return ;
        }
        if(since_id === NO_MORE){
            return;
        }
        var query = {
              room: id,
              since_id_to_pre: since_id ? since_id: null,
              take: ONCE_TAKE_NUM,
              expand: 'owner, room',
              reverse: true
          };
        this.props.actions.getRoomMessage(query);
  },
  getDataSource: function(subjects: Array<any>): ListView.DataSource {
      return this.state.dataSource.cloneWithRows(subjects);
  },
  renderRow: function(row: Object, 
  	sectionID: number, 
  	rowID: number,
  	highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void){

            if(row.text.startsWith('upload://')){
                var id = row.text.split('/')[3];
                var url= api.HOST + 'uploads/' + id;
                return (
                  <TouchableHighlight  
                        key={rowID}
                        style={{flex: 1}}
                        onPress={()=>this.selectRow(row)}
                        onHighlight={() => highlightRowFunc(sectionID, rowID)}
                        onUnhighlight={() => highlightRowFunc(null, null)} >
                        <View style={styles.rowContainer}>
                            <Image
                                style={styles.icon}
                                source={{uri: api.HOST + row.owner.avatarDir +'/'+ row.owner.avatar}}
                            />
                        <View style={styles.rowDetailsContainer}>
                            <Text style={styles.rowTitle}>
                                {row.owner.displayName}
                            </Text>
                            <Image
                                style={styles.imageContent}
                                source={{uri:url}}
                            />
                            <Text style={styles.rowPosted}>
                                {row.posted}
                            </Text>
                        </View>
                    </View>
                  </TouchableHighlight>
                    );
            }else{
            return(
              <TouchableHighlight  
                    key={rowID}
                    style={{flex: 1}}
                    onPress={()=>this.selectRow(row)}
                    onHighlight={() => highlightRowFunc(sectionID, rowID)}
                    onUnhighlight={() => highlightRowFunc(null, null)} >
                    <View style={styles.rowContainer}>
                        <Image
    		style={styles.icon}
    		source={{uri: api.HOST + row.owner.avatarDir +'/'+ row.owner.avatar}}
    	       />
                    <View style={styles.rowDetailsContainer}>
                        <Text style={styles.rowTitle}>
                            {row.owner.displayName}
                        </Text>
                        <Text style={styles.rowDetailsLine}>
                            {row.text}
                        </Text>
                        <Text style={styles.rowPosted}>
                            {row.posted}
                        </Text>
                    </View>
                </View>
              </TouchableHighlight>
            );
        }
  },
  selectRow: function(row){

  },
  renderSeparator: function(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
        return(
            <View style={styles.separator}/>
        );
  },
    render: function(){

        var pageStyle = {
            backgroundColor:'red',
            alignItems: 'center',
            padding: 20,
        };

        var listStyle = {
            translateY: this.state.scrollY,
        };
        return (
            <ScrollView key='1' onScroll = {this.listViewScroll}
                {...this._panResponder.panHandlers}
                ref={scrollview => { this.scrollview = scrollview; }}
              >
            {this.renderIndicator()}
              <ListView
                      ref={listview => { this.listview = listview; }}
        	        style={[styles.listview,listStyle]}
        	        dataSource={this.state.dataSource}
        	        renderRow={this.renderRow}
        	        onEndReached={this.onEndReached}
        	        automaticallyAdjustContentInsets={false}
        	        keyboardDismissMode="on-drag"
        	        keyboardShouldPersistTaps={true}
        	        showsVerticalScrollIndicator={true}
        	        renderSeparator={this.renderSeparator} />
              </ScrollView>
          );
    }

  });

var styles = StyleSheet.create({
    centerEmpty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#FAFAFA',
    },
    listview: {
      backgroundColor: '#FAFAFA',
    },
    rowContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowDetailsContainer: {
        flex: 1,
    },
    rowTitle: {
        fontSize: 15,
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 4,
        marginRight: 10,
        color: '#FF6600'
    },
    rowDetailsLine: {
        fontSize: 12,
        marginBottom: 10,
        color: 'black',
    },
    rowPosted: {
        fontSize: 12,
        marginBottom: 4,
        color: 'gray',
        marginRight: 10,
        textAlign: 'right',
    },
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC'
    },
  icon: {
    width: 50,
    height: 50,
    margin: 10,
    marginLeft: 10,
  },
  imageContent: {
    width: 100,
    height: 100,
    margin: 10,
    marginLeft: 10,
  },
  indicator:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    top:0,
    left:0,
    width:deviceWidth
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(MessageList)