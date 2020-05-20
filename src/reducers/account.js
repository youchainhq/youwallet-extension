/**
 * Created by sean@ihuanqu.com on 2019/3/25.
 */
import _ from "lodash";
import {handleActions} from 'redux-actions';

const initialState = {
  list:{},
  current:""
};

export default handleActions({
  INIT_STORE_DONE(state,action){
    return {...state,...action.payload.account};
  },
  GET_BALANCE_DONE(state,action){
    let newState = {...state};
    if(newState.list[action.payload.accountAddress]){
      newState.list[action.payload.accountAddress].balance = action.payload.balance;
    }
    return newState;
  },
  CREATE_ACCOUNT_DONE(state,action){
    let list = {...state.list};
    let current = action.payload.address;
    list[action.payload.address] = action.payload;

    return {...state,list,current};
  },
  IMPORT_ACCOUNT_DONE(state,action){
    let list = {...state.list};
    let current = action.payload.address;
    list[action.payload.address] = action.payload;

    return {...state,list,current};
  },
  SWITCH_ACCOUNT_DONE(state,action) {
    let newState = {...state};
    newState.current = action.payload;

    return newState;
  },
  REMOVE_ACCOUNT_DONE(state,action){
    let list = {...state.list};
    list = _.omit(list,[action.payload.accountAddress]);
    let current = action.payload.currentAccount;

    return {...state,list,current};
  },
  UPDATE_ACCOUNT_NAME_DONE(state,action) {
    let list = {...state.list};
    if(list[action.payload.address]){
      list[action.payload.address].name = action.payload.name;
    }

    return {...state,list};
  }
}, initialState);