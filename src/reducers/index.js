'use strict';

import socket from './SocketReducer';
import room from './RoomReducer';
import message from './MessageReducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  socket,
  room,
  message
});

export default rootReducer;
