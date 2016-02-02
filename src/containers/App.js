'use strict';

import React from 'react-native'

let {
  StyleSheet,
  Navigator,
  PropTypes
} = React
import * as socketActions from '../actions/SocketActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Map} from 'immutable';
var MainContainer = require('./MainContainer').default;

const actions = [
  socketActions
];

function mapStateToProps(state) {
  return {
      ...state
  };
};


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

let App = React.createClass ({

  componentWillReceiveProps: function(nextProps){

      const {connectStatus} = this.props.socket;
      if(connectStatus !== nextProps.socket.connectStatus){
          if(nextProps.socket.connectStatus === 'connecting'){

          }else if(nextProps.socket.connectStatus === 'success'){

              nextProps.actions.getRoomList({ users: true });
              nextProps.actions.addOnNewMessageListener();
          }else if(nextProps.socket.connectStatus === 'timeout'){
              nextProps.actions.connect(); 
          }
      }

  },
  renderScene: function(route, navigator) {
    let Component = route.component

    return (
      <Component navigator={navigator} route={route} />
    );
  },

  configureScene: function(route) {
    if (route.name && route.name === 'Search') {
      return Navigator.SceneConfigs.FadeAndroid;
    } else {
      return Navigator.SceneConfigs.FloatFromBottomAndroid;
    }
  },

  render() {
    return (
      <Navigator
        ref='navigator'
        style={styles.navigator}
        configureScene={this.configureScene}
        renderScene={this.renderScene}
        initialRoute={{
          component: MainContainer,
          name: 'Main'
        }}  />
      
    );
  }
});

let styles = StyleSheet.create({
  navigator: {
    flex: 1
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
