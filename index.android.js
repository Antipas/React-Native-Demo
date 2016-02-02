// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  */
// 'use strict';

// var React = require('react-native');

// var {
//   AppRegistry,
//   Component,
//   StyleSheet,
//   Navigator,
//   BackAndroid,
//   Text,
//   View,
// } = React;


// var MainScreen = require('./MainScreen');

// var _navigator;
// BackAndroid.addEventListener('hardwareBackPress', () => {
//   if (_navigator.getCurrentRoutes().length === 1  ) {
//      return false;
//   }
//   _navigator.pop();
//   return true;
// });

// var RiochatMobile = React.createClass({
//     RouteMapper: function(route, navigationOperations, onComponentRef) {
//     _navigator = navigationOperations;
//     if (route.name === 'room') {
//       return (
//         <View style={styles.container}>
//           <MainScreen navigator={navigationOperations}/>
//         </View>
//       );
//     } else if (route.name === 'roomlist') {
//       return (
//         <View style={styles.container}>
//           <Text>this is roomlist</Text>
//         </View>
//       );
//     }
//   },
//   render: function() {
//       var initialRoute = {name: 'room'};
//       return (
//         <Navigator
//               style={styles.container}
//               initialRoute={initialRoute}
//               configureScene={() => Navigator.SceneConfigs.FadeAndroid}
//               renderScene={this.RouteMapper}
//         />
//       );
//   }
// });

// var styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });


// AppRegistry.registerComponent('RiochatMobile', () => RiochatMobile);
'use strict';
import React from 'react-native'
import RiochatMobile from './src/RiochatMobile';

const {
  AppRegistry
} = React

AppRegistry.registerComponent('RiochatMobile', () => RiochatMobile)