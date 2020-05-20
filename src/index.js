/**
 * Created by sean@ihuanqu.com on 2018/8/30.
 */
import "./styles/main.less";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import configureStore from './store';
import "./popup";
import App from "./containers/app";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);


