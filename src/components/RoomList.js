'use strict';

var React = require('react-native');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';
import * as socketActions from '../actions/SocketActions';

var {
  AsyncStorage,
  Platform,
  ListView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  TouchableHighlight,
} = React

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

var RoomList = React.createClass({
  getInitialState: function() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    return {
      dataSource: dataSource,
    };
  },
  componentWillReceiveProps: function(nextProps){
    const {rooms} = this.props.room;
      // load room list
      if(rooms !== nextProps.room.rooms){
          if(nextProps.room.rooms ){
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(nextProps.room.rooms),
              });
              return;
          }
        }
  },
  renderHeader: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return(
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableElement>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
              <Image
                source={require('../img/ic_comment_white.png')} 
                style={{width: 40, height: 40, marginLeft: 8, marginRight: 8}} />
              <Text style={styles.menuText}>
                UserName
              </Text>
            </View>
          </TouchableElement>
          <View style={styles.row}>
            <TouchableElement>
              <View style={styles.menuContainer}>
                <Image
                  source={require('../img/ic_favorites_white.png')}
                  style={{width: 30, height: 30}} />
                <Text style={styles.menuText}>
                  我的收藏
                </Text>
              </View>
            </TouchableElement>
            <TouchableElement>
              <View style={styles.menuContainer}>
              <Image
                source= {require('../img/ic_download_white.png')}
                style={{width: 30, height: 30}} />
                <Text style={styles.menuText}>
                  离线下载
                </Text>
              </View>
            </TouchableElement>
          </View>
        </View>
        <TouchableElement onPress={() => this.props.onSelectItem(null)}>
          <View style={styles.themeItem}>
            <Image
              source={require('../img/home.png')}
              style={{width: 30, height: 30, marginLeft: 10}} />
            <Text style={styles.homeTheme}>
              私有房间
            </Text>
          </View>
        </TouchableElement>
      </View>
    );
  },
  renderRow: function(
    room: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    
    return (
      <View>
        <TouchableElement
          onPress={() => this.props.onSelectItem(room.id)}
          onShowUnderlay={highlightRowFunc}
          onHideUnderlay={highlightRowFunc}>
          <View style={styles.themeItem}>
            <Text style={styles.themeName}>
              {room.name}
            </Text>
            
          </View>
        </TouchableElement>
      </View>
    );
  },
  render: function() {
    return (
      <View style={styles.container} {...this.props}>
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
            renderHeader={this.renderHeader}
            style={{flex:1, backgroundColor: 'white'}}
        />
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flex: 1,
    flexDirection: 'column',
  },
  userInfo: {
    flex: 1,
    backgroundColor: '#00a2ed',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  menuText: {
    fontSize: 14,
    color: 'white',
  },
  homeTheme: {
    fontSize: 16,
    marginLeft: 16,
    color: '#00a2ed'
  },
  themeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  themeIndicate: {
    marginRight: 16,
    width: 16,
    height: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

export default connect(mapStateToProps,mapDispatchToProps)(RoomList)

