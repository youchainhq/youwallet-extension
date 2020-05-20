import { createStore, applyMiddleware, compose } from 'redux';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import sagas from '../sagas';

export default function configure(initialState) {
  const middleware = [];

  const sagaMiddleware = createSagaMiddleware();

  middleware.push(sagaMiddleware);

  // middleware.push(createLogger());

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware))
  );

  sagas.map(saga => sagaMiddleware.run(saga));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}