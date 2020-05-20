import _ from "lodash";
import { put, take, fork } from "redux-saga/effects";
import { types } from "../actions";

import AccountController from "../controllers/account";
import TokenController from "../controllers/token";

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
  yield sendRequestStatus(types.REQUEST_SUCCESSFUL, request, data,meta);
}

function* requestFailed(request, data) {
  yield sendRequestStatus(types.REQUEST_FAILED, request, data,meta);
}

function* createAccount() {
  while (true) {
    const type = types.CREATE_ACCOUNT;
    const action = yield take(type);
    const payload = action.payload || {};

    try{
      let account = AccountController.create(payload);
      const initToken = TokenController.getInitToken(account.address);
      const tokenId = TokenController.getTokenId();
      let token = TokenController.get(tokenId);

      const balance = yield TokenController.getBalance(account.address);

      account.balance = balance || 0;

      if(token) {
        token.balance = balance;
        TokenController.update(token);
      }

      yield put({
        type:`${type}_DONE`,
        payload:account
      });

      yield put({
        type:"INIT_TOKEN_DONE",
        payload:initToken
      });

      yield put({
        type:"UPDATE_TOKEN_BALANCE_DONE",
        payload:{
         tokenId:tokenId,
         balance: balance || 0
        }
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

function* importAccount() {
  while (true) {
    const type = types.IMPORT_ACCOUNT;
    const action = yield take(type);
    const payload = action.payload || {};

    try{
      let account = AccountController.import(payload);

      const initToken = TokenController.getInitToken(account.address);
      const tokenId = TokenController.getTokenId();
      let token = TokenController.get(tokenId);

      const balance = yield TokenController.getBalance(account.address);
      account.balance = balance || 0;

      if(token) {
        token.balance = balance;
        TokenController.update(token);
      }

      yield put({
        type:`${type}_DONE`,
        payload:account
      });

      yield put({
        type:"INIT_TOKEN_DONE",
        payload:initToken
      });

      yield put({
        type:"UPDATE_TOKEN_BALANCE_DONE",
        payload:{
          tokenId:tokenId,
          balance: balance || 0
        }
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

function* switchAccount() {
  while (true) {
    const type = types.SWITCH_ACCOUNT;
    const action = yield take(type);
    const address = action.payload || "";

    try{
      AccountController.switch(address);

      const tokenId = TokenController.getTokenId();

      if(tokenId){
        TokenController.switch(tokenId);
      }

      yield put({
        type:`${type}_DONE`,
        payload:address
      });

      yield put({
        type:"SWITCH_TOKEN_DONE",
        payload:tokenId
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

function* removeAccount() {
  while (true) {
    const type = types.REMOVE_ACCOUNT;
    const action = yield take(type);
    const accountAddress = action.payload || "";

    try{
      const currentAccount = AccountController.remove(accountAddress);
      const tokenId = TokenController.getTokenId();

      if(tokenId){
        TokenController.switch(tokenId);
      }

      yield put({
        type:`${type}_DONE`,
        payload:{
          accountAddress,
          currentAccount
        }
      });

      yield put({
        type:"SWITCH_TOKEN_DONE",
        payload:tokenId
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

function* updateAccountName() {
  while (true) {
    const type = types.UPDATE_ACCOUNT_NAME;
    const action = yield take(type);
    const account = action.payload || {};

    try{
      AccountController.update(account);

      yield put({
        type:`${type}_DONE`,
        payload:account
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

export default function*() {
  yield fork(createAccount);
  yield fork(importAccount);
  yield fork(switchAccount);
  yield fork(updateAccountName);
  yield fork(removeAccount);
}