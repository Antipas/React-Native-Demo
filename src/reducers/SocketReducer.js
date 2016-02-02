'use strict';
import * as types from '../constants/ActionTypes';



export default function socketReducer(state = {
    connectStatus: null
},action){
    switch(action.type){
        case types.START_CONNECT:
            return Object.assign({}, state, {
              connectStatus: "connecting"
            });    
        case types.CONNECT_SUCCESS:
            return Object.assign({}, state, {
              connectStatus: "success"
            });    
        case types.CONNECT_FAILED:
            return Object.assign({}, state, {
              connectStatus: action.err
            });    

        case types.DISCONNECT:
            return Object.assign({}, state, {
              connectStatus: action.err
            });    

        default:
            return state;     
    }
}

	