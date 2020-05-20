import { put, take, fork } from "redux-saga/effects";
import { types } from "../actions";

import AppController from "../controllers/app";
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

function* signOut() {
  while (true) {
    const type = types.SIGN_OUT;
    const action = yield take(type);

    try {
      AppController.signOut();

      yield put({
        type:`${type}_DONE`
      });

      yield requestSuccessful(type);
    }
    catch (e) {
      yield requestFailed(type,{msg:e.message});
    }
  }
}

function* initStore() {
  while (true) {
    const type = types.INIT_STORE;
    const action = yield take(type);
    const payload = action.payload || {};

    yield put({
      type:`${type}_DONE`,
      payload:payload
    });

    yield requestSuccessful(type);
  }
}

function* switchNetwork() {
  while (true) {
    const type = types.SWITCH_NETWORK;
    const action = yield take(type);
    const network = action.payload || {};

    try{
      AppController.switchNetwork(network.key);

      const tokenId = TokenController.getTokenId();
      TokenController.switch(tokenId);

      yield put({
        type:`${type}_DONE`,
        payload:network
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

function* saveCustom() {
  while (true) {
    const type = types.SAVE_CUSTOM;
    const action = yield take(type);
    const data = action.payload || {};

    try{
      AppController.saveCustom(data);

      yield put({
        type:`${type}_DONE`,
        payload:data
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

export default function*() {
  yield fork(signOut);
  yield fork(initStore);
  yield fork(switchNetwork);
  yield fork(saveCustom);
}