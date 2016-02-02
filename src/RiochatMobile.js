'use strict';
import React from 'react-native'

import { Provider } from 'react-redux';
import configStore from './store/configStore'

import App from './containers/App'

const store = configStore()

let RiochatMobile = React.createClass( {
      render() {
          return (
              <Provider store={store}>
                  <App store={store}/>
              </Provider>
          );
      }
  });

module.exports = RiochatMobile