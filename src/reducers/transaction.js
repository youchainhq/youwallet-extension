import _ from "lodash";
import {handleActions} from 'redux-actions';

const initialState = {
  list:[],
  pending:[]
};

export default handleActions({
  INIT_STORE_DONE(state,action){
    return {...state,...action.payload.transaction};
  },
  SEND_TRANSACTION_DONE(state,action){
    let pending = [...state.pending];

    let transaction = _.find(pending,(item)=>{
      return item.transactionHash === action.payload.transactionHash;
    });

    if(!transaction){
      pending = [action.payload,...pending];
    }

    return {...state,pending};
  },
  CONFIRM_TRANSACTION_DONE(state,action){
    let pending = [...state.pending];

    let transaction = _.find(pending,(item)=>{
      return item.transactionHash === action.payload.transactionHash;
    });

    if(transaction){
      transaction.status = action.payload.status;
    }

    return {...state,pending};
  },
  RECEIPT_TRANSACTION_DONE(state,action){
    let pending = [...state.pending];
    let list = [...state.list];

    let pendingData = _.find(pending,(item)=>{
      return item.transactionHash === action.payload.transactionHash;
    });

    let transaction = _.find(list,(item)=>{
      return item.transactionHash === action.payload.transactionHash;
    });

    if(transaction){
      transaction = {
        ...(pendingData || {}),
        ...action.payload
      };
    }
    else{
      if(pendingData){
        transaction = {
          ...(pendingData || {}),
          ...action.payload
        };

        list = [
          transaction,
          ...list
        ];

        _.remove(pending,["transactionHash",action.payload.transactionHash]);
      }
      else{
        list = [action.payload,...list];
      }
    }

    return {...state,list,pending};
  },
  FAIL_TRANSACTION_DONE(state,action){
    let pending = [...state.pending];
    let list = [...state.list];

    let pendingData = _.find(pending,(item)=>{
      return item.transactionHash === action.payload.transactionHash;
    });

    let transaction = _.find(list,(item)=>{
      return item.transactionHash === action.payload.transactionHash;
    });

    if(transaction){
      transaction = {
        ...(pendingData || {}),
        ...action.payload
      }
    }
    else{
      if(pendingData){
        transaction = {
          ...(pendingData || {}),
          ...action.payload
        };

        list = [
          transaction,
          ...list
        ];

        _.remove(pending,["transactionHash",action.payload.transactionHash]);
      }
      else{
        list = [action.payload,...list];
      }
    }

    return {...state,list,pending};
  },
  CLEAR_TRANSACTION_DONE(state,action){
    return initialState
  }
}, initialState);