'use strict';

var React = require('react-native');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';
import * as socketActions from '../actions/SocketActions';
var RoomList = require('../components/RoomList').default;
var MessageList = require('../components/MessageList').default;

var {
  TextInput,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ToolbarAndroid,
  DrawerLayoutAndroid
} = React

var deviceWidth = Dimensions.get('window').width;
var DRAWER_REF = 'drawer';
var DRAWER_WIDTH_LEFT = 56;
var toolbarActions = [
  {title: '提醒', show: 'always'},
  {title: '夜间模式', show: 'never'},
  {title: '设置选项', show: 'never'},
];

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

var MainContainer = React.createClass({
    getInitialState: function(){
        return{
            result: null,
            roomList: null,
            text: null
        };
    },
    componentDidMount: function(){
      if(this.props.socket.connectStatus !== 'success'){
          this.props.actions.connect();
      }
    },

    componentWillReceiveProps: function(nextProps) {

    },
    clearText: function(){
      this._textInput.setNativeProps({text:""});
    },
    onSend: function(){
      var message = {
          room: this.props.room.resRoom.id,
          text: this.state.text
      };
      this.props.actions.sendMessage(message);
      this.clearText();
    },
    renderNavigationView: function() {
      return (
        <RoomList   onSelectItem={this.onSelectRoom} />       
      );
    },
    onSelectRoom: function(roomId) {
      this.props.actions.joinRoom(roomId);
      this.refs[DRAWER_REF].closeDrawer();
    },
    render: function() {
      var title =  '首页';
      return (
        <DrawerLayoutAndroid
            ref={DRAWER_REF}
            drawerWidth={deviceWidth - DRAWER_WIDTH_LEFT}
            keyboardDismissMode="on-drag"
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={this.renderNavigationView}>
              <View style={styles.container}>
                <ToolbarAndroid
                  title={title}
                  titleColor="white"
                  style={styles.toolbar}
                  actions={toolbarActions}
                  onIconClicked={() => this.refs[DRAWER_REF].openDrawer()}
                  onActionSelected={this.onActionSelected} />

                  <View style={{flex:1}}>
                    <Text>status:  {this.props.socket.connectStatus}</Text>
                    <MessageList   
                        ref={messageList => { this.messageList = messageList; }}
                    />
                    <View style={styles.flexContainer}>
                               <TextInput
                                   underlineColorAndroid = "transparent"  
                                   textAlignVertical = "top"  
                                   ref={component => this._textInput = component}
                                   style={styles.textInput}
                                   onChangeText={(text) => this.setState({text})}
                                   value={this.state.text}
                                   onFocus={this.onFocus}
                                />
                                <TouchableOpacity onPress={this.onSend} style={styles.button}>
                                    <Text style={styles.buttonText}>{"Send"}</Text>
                                </TouchableOpacity>
                    </View>
                  </View>

              </View>
        </DrawerLayoutAndroid>
      );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FAFAFA',
    },
    toolbar: {
        backgroundColor: '#00a2ed',
        height: 56,
    },
    button: {
        alignItems: 'center', 
        justifyContent: 'center',
        flex: 0.2,
        height: 40
     },
    buttonText: {
        borderColor: '#c6c7ca',
        color: '#5890ff',
    },
    textInput: {
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,
        flex: 0.8
    },
    flexContainer: {
        flexDirection: 'row'
    },
});

export default connect(mapStateToProps,mapDispatchToProps)(MainContainer)
