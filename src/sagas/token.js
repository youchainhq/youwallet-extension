import { put, take, fork } from "redux-saga/effects";
import { types } from "../actions";

import TokenController from "../controllers/token";
import AccountController from "../controllers/account";

function* sendRequestStatus(type, request, data,meta) {
  yield put({
    type,
    payload: {
      type,
      request,
      data,
      meta
    }
  });
}

function* requestSuccessful(request, data,meta) {
  yield sendRequestStatus(types.REQUEST_SUCCESSFUL, request, data, meta);
}

function* requestFailed(request, data,meta) {
  yield sendRequestStatus(types.REQUEST_FAILED, request, data, meta);
}

function* getBalance() {
  while (true) {
    const type = types.GET_BALANCE;
    const action = yield take(type);
    const payload = action.payload || {};

    try{
      const balance = yield TokenController.getBalance(payload.accountAddress);

      let token = TokenController.get(payload.tokenId);
      let account = AccountController.get(payload.accountAddress);

      if(token) {
        token.balance = balance;
        TokenController.update(token);
      }

      if(account){
        account.balance = balance;
        AccountController.update(account);
      }

      yield put({
        type:`${type}_DONE`,
        payload:{
          ...payload,
          ...{
            balance:balance
          }
        }
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

function* getTokenBalance() {
  while (true) {
    const type = types.GET_TOKEN_BALANCE;
    const action = yield take(type);
    const payload = action.payload || {};

    try{
      const balance = yield TokenController.getTokenBalance({
        address:payload.tokenAddress,
        accountAddress:payload.accountAddress
      });

      let token = TokenController.get(payload.tokenId);

      if(token){
        token.balance = balance.balance || 0;
        TokenController.update(token);
      }

      yield put({
        type:`${type}_DONE`,
        payload:{
          ...payload,
          ...{
            balance:balance.balance || 0
          }
        }
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

function* createToken() {
  while (true) {
    const type = types.CREATE_TOKEN;
    const action = yield take(type);
    const payload = action.payload || {};

    try{
      const balance = yield TokenController.getTokenBalance({
        address:payload.address,
        accountAddress:payload.accountAddress
      });

      const data = {
        ...payload,
        ...{
          balance:balance.balance || 0
        }
      };

      TokenController.create(data);

      yield put({
        type:`${type}_DONE`,
        payload:data
      });

      yield requestSuccessful(type,data,action.meta);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message},action.meta);
    }
  }
}

function* switchToken() {
  while (true) {
    const type = types.SWITCH_TOKEN;
    const action = yield take(type);
    const tokenId = action.payload || "";

    try{
      TokenController.switch(tokenId);

      yield put({
        type:`${type}_DONE`,
        payload:tokenId
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

function* removeToken() {
  while (true) {
    const type = types.REMOVE_TOKEN;
    const action = yield take(type);
    const tokenId = action.payload || "";

    try{
      const currentToken = TokenController.remove(tokenId);

      yield put({
        type:`${type}_DONE`,
        payload:{
          tokenId:tokenId,
          currentToken:currentToken
        }
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

export default function*() {
  yield fork(getBalance);
  yield fork(getTokenBalance);
  yield fork(createToken);
  yield fork(switchToken);
  yield fork(removeToken);
}