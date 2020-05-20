import { put, take, fork } from "redux-saga/effects";
import { types } from "../actions";

import TransactionController from "../controllers/transaction";

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

function* requestFailed(request, data,meta) {
  yield sendRequestStatus(types.REQUEST_FAILED, request, data,meta);
}

function* sendTransaction() {
  while (true) {
    const type = types.SEND_TRANSACTION;
    const action = yield take(type);
    const payload = action.payload || {};

    try{
      TransactionController.addPending(payload);

      yield put({
        type:`${type}_DONE`,
        payload:payload
      });

      yield requestSuccessful(type,payload,action.meta);
    }
    catch (e){
      yield requestFailed(type,{msg:e.message},action.meta);
    }
  }
}

function* confirmTransaction() {
  while (true) {
    const type = types.CONFIRM_TRANSACTION;
    const action = yield take(type);
    const payload = action.payload || {};

    yield put({
      type:`${type}_DONE`,
      payload:payload
    });

    yield requestSuccessful(type,payload);
  }
}

function* receiptTransaction() {
  while (true) {
    const type = types.RECEIPT_TRANSACTION;
    const action = yield take(type);
    const payload = action.payload || {};

    try{
      TransactionController.add(payload);
      TransactionController.removePending(payload.transactionHash);

      yield put({
        type:`${type}_DONE`,
        payload:payload
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

function* failTransaction() {
  while (true) {
    const type = types.FAIL_TRANSACTION;
    const action = yield take(type);
    const payload = action.payload || {};

    try{
      TransactionController.add(payload);
      TransactionController.removePending(payload.transactionHash);

      yield put({
        type:`${type}_DONE`,
        payload:payload
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

function* clearTransaction() {
  while (true) {
    const type = types.CLEAR_TRANSACTION;
    const action = yield take(type);

    try{
      TransactionController.clear();

      yield put({
        type:`${type}_DONE`
      });

      yield requestSuccessful(type);
    }
    catch(e){
      yield requestFailed(type,{msg:e.message});
    }
  }
}

export default function*() {
  yield fork(sendTransaction);
  yield fork(confirmTransaction);
  yield fork(receiptTransaction);
  yield fork(failTransaction);
  yield fork(clearTransaction);
}