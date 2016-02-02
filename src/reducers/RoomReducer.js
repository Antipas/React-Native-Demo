'use strict';
import * as types from '../constants/ActionTypes';



export default function roomReducer(state = {
    rooms: null
},action){
    switch(action.type){
        case types.GET_ROOM_LIST:
            return Object.assign({}, state, {
                rooms: action.rooms
            });    

        case types.JOIN_ROOM:
            return Object.assign({},state, {
                resRoom: action.resRoom
            });

        default:
            return state;     
    }
}

	