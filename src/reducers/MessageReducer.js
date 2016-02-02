'use strict';
import * as types from '../constants/ActionTypes';



export default function messageReducer(state = {
    messages: null,
    newMessage: null
},action){
    switch(action.type){
        case types.GET_MESSAGE:
            return Object.assign({}, state, {
                messages: action.messages
            });    
        case types.NEW_MESSAGE:
            return Object.assign({}, state, {
                newMessage: action.newMessage
            });    

        default:
            return state;     
    }
}

	