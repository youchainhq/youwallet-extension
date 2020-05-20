import _ from "lodash";
import {handleActions} from 'redux-actions';
import configs from "../common/configs";

const initialState = {
  network:configs.networks.test,
  custom:{},
  usd:0
};

export default handleActions({
  SET_USD(state,action){
    let newState = {...state};
    newState.usd = parseFloat(action.payload);

    return newState;
  },
  INIT_STORE_DONE(state,action){
    return {...state,...action.payload.app};
  },
  SWITCH_NETWORK_DONE(state,action) {
    let newState = {...state};
    newState.network = action.payload;

    return newState;
  },
  SAVE_CUSTOM_DONE(state,action) {
    let newState = {...state};
    newState.custom = action.payload;

    return newState;
  }
}, initialState);