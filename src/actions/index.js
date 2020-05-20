import { createAction } from 'redux-actions';

export const types = {
  REQUEST_START: "REQUEST_START",
  REQUEST_SUCCESSFUL: "REQUEST_SUCCESSFUL",
  REQUEST_FAILED: "REQUEST_FAILED",
  RESET: "RESET",
  SHOW_TOAST: 'SHOW_TOAST',
  CLEAR_TOAST: 'CLEAR_TOAST',

  SET_USD:"SET_USD",
  INIT_STORE:"INIT_STORE",
  SIGN_OUT:"SIGN_OUT",
  SWITCH_NETWORK:"SWITCH_NETWORK",
  SAVE_CUSTOM:"SAVE_CUSTOM",

  CREATE_ACCOUNT:"CREATE_ACCOUNT",
  IMPORT_ACCOUNT:"IMPORT_ACCOUNT",
  SWITCH_ACCOUNT:"SWITCH_ACCOUNT",
  UPDATE_ACCOUNT_NAME:"UPDATE_ACCOUNT_NAME",
  REMOVE_ACCOUNT:"REMOVE_ACCOUNT",

  SEND_TRANSACTION:"SEND_TRANSACTION",
  CONFIRM_TRANSACTION:"CONFIRM_TRANSACTION",
  RECEIPT_TRANSACTION:"RECEIPT_TRANSACTION",
  FAIL_TRANSACTION:"FAIL_TRANSACTION",
  CLEAR_TRANSACTION:"CLEAR_TRANSACTION",

  GET_BALANCE:"GET_BALANCE",
  GET_TOKEN_BALANCE:"GET_TOKEN_BALANCE",
  CREATE_TOKEN:"CREATE_TOKEN",
  SWITCH_TOKEN:"SWITCH_TOKEN",
  REMOVE_TOKEN:"REMOVE_TOKEN",
};

export const reset = createAction(types.RESET); // 重置数据状态
export const showToast = createAction(types.SHOW_TOAST);
export const clearToast = createAction(types.CLEAR_TOAST);

export const setUsd = createAction(types.SET_USD);

export const initStore = createAction(types.INIT_STORE);
export const signOut = createAction(types.SIGN_OUT);
export const switchNetwork = createAction(types.SWITCH_NETWORK);
export const saveCustom = createAction(types.SAVE_CUSTOM);

export const createAccount = createAction(types.CREATE_ACCOUNT);
export const importAccount = createAction(types.IMPORT_ACCOUNT);
export const switchAccount = createAction(types.SWITCH_ACCOUNT);
export const updateAccountName = createAction(types.UPDATE_ACCOUNT_NAME);
export const removeAccount = createAction(types.REMOVE_ACCOUNT);

export const sendTransaction = createAction(types.SEND_TRANSACTION,null,(requestData,metaData) =>{return metaData;});
export const confirmTransaction = createAction(types.CONFIRM_TRANSACTION);
export const receiptTransaction = createAction(types.RECEIPT_TRANSACTION);
export const failTransaction = createAction(types.FAIL_TRANSACTION);
export const clearTransaction = createAction(types.CLEAR_TRANSACTION);

export const getBalance = createAction(types.GET_BALANCE);
export const getTokenBalance = createAction(types.GET_TOKEN_BALANCE);
export const createToken = createAction(types.CREATE_TOKEN, null, (requestData,metaData) =>{return metaData;});
export const switchToken = createAction(types.SWITCH_TOKEN);
export const removeToken = createAction(types.REMOVE_TOKEN);


