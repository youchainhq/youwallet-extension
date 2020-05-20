import _ from "lodash";
import {handleActions} from 'redux-actions';

const initialState = {
  list:[],
  current:""
};

export default handleActions({
  INIT_STORE_DONE(state,action){
    return {...state,...action.payload.token};
  },
  INIT_TOKEN_DONE(state,action){
    let list = [...state.list];
    list = [...list,...action.payload.list];
    let current = action.payload.current;

    return {...state,list,current};
  },
  GET_BALANCE_DONE(state,action){
    let list = [...state.list];
    let token = _.find(list,["tokenId",action.payload.tokenId]);

    if(token){
      token.balance = action.payload.balance;
    }

    return {...state,list};
  },
  UPDATE_TOKEN_BALANCE_DONE(state,action){
    let list = [...state.list];
    let token = _.find(list,["tokenId",action.payload.tokenId]);

    if(token){
      token.balance = action.payload.balance;
    }

    return {...state,list};
  },
  GET_TOKEN_BALANCE_DONE(state,action){
    let list = [...state.list];
    let token = _.find(list,["tokenId",action.payload.tokenId]);

    if(token){
      token.balance = action.payload.balance;
    }

    return {...state,list};
  },
  CREATE_TOKEN_DONE(state,action){
    let list = [...state.list];
    let token = _.find(list,["tokenId",action.payload.tokenId]);
    if(!token){
      list.push(action.payload);
    }

    return {...state,list};
  },
  SWITCH_TOKEN_DONE(state,action) {
    let newState = {...state};
    newState.current = action.payload;

    return newState;
  },
  REMOVE_TOKEN_DONE(state,action) {
    let list = [...state.list];

    _.remove(list,["tokenId",action.payload.tokenId]);
    let current = action.payload.currentToken;

    return {...state,list,current};
  },
  REMOVE_ACCOUNT_DONE(state,action){
    let list = [...state.list];

    _.remove(list,["accountAddress",action.payload.accountAddress]);

    return {...state,list};
  }
}, initialState);