import { combineReducers } from 'redux';

import ui from './ui';
import app from './app';
import account from './account';
import transaction from './transaction';
import token from './token';

const rootReducer = combineReducers({
  ui,
  app,
  account,
  transaction,
  token
});

export default rootReducer;