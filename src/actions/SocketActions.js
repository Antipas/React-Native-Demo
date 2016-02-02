'use strict';
import * as types from '../constants/ActionTypes';
window.navigator.userAgent = 'react-native';
var io = require('socket.io-client/socket.io');

var socket;

function connectSuccess () {
	return{
	   type: types.CONNECT_SUCCESS
	};
}

function connectFailed (err) {
  return{
    type: types.CONNECT_FAILED,
    err: err
  };
}

function disConnect(err){
  return{
    type: types.DISCONNECT,
    err: err
  };
}

function startConnect(){
    return{
        type: types.START_CONNECT
    };
}

function getRoomListSuccess(json) {
  return {
    type: types.GET_ROOM_LIST,
    rooms: json
  };
}

function joinRoomSucess(room){
    return{
        type: types.JOIN_ROOM,
        resRoom: room
    }
}

function getMessages(messages){
    return{
        type: types.GET_MESSAGE,
        messages: messages
    }
}

function addMessage(message){
    return{
        type: types.NEW_MESSAGE,
        newMessage: message
    }
}

export function connect(){
    return dispatch => {
      dispatch(startConnect());
      socket = io('http://192.168.160.72:5000?token=NTY2YThmMjI1ZWJmOTQwMTBjNzY5ODk4OmM3NzQ0MjRmNmM5OGY4MjI3M2ZlMGZjODUwNGEyNWUxOGJlYjVkMGM5MTVjMGZmMQ==', 
          {transports: ['websocket'],
          jsonp: false});

          socket.connect();

          socket.on('connect', function(){
              dispatch(connectSuccess());
          });

          socket.on('error',function(err){
              dispatch(connectFailed(err));
          });

          socket.on('connect_error',function(err){
              dispatch(connectFailed(err));
          });

          socket.on('disconnect',function(){
              dispatch(disConnect());
          });
    };
}

export function getRoomList(query){
    return dispatch => {
        socket.emit('rooms:list', query, function(rooms){
            dispatch(getRoomListSuccess(rooms));
        });        
    }  
}

export function joinRoom(roomId){
    return dispatch => {
        socket.emit('rooms:join',{roomId: roomId}, function(resRoom) {
            dispatch(joinRoomSucess(resRoom));
        });
    }
}

export function getRoomMessage(query){
    return dispatch => {
       socket.emit('messages:list', query, function(messages){
          dispatch(getMessages(messages));
       });
    }
}

export function sendMessage (message) {
    // don't deal response
    return dispatch => {
       socket.emit('messages:create', message);
    }
}

export function addOnNewMessageListener(){
    return dispatch => {  
        socket.on('messages:new', function(message) {
            dispatch(addMessage(message));
        });
    }
}

export function getUserInfo (argument) {
  // body...
}
