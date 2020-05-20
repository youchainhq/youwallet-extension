import _ from "lodash";
import Storage from "../common/storage";
import Utils from "../common/utils";
import configs from "../common/configs";

const AppController = {
  signOut(){
    Storage.unAuthenticate();
  },

  switchNetwork(key){
    Storage.saveNetwork(key);
  },

  saveCustom(data){
    Storage.saveCustom(data);
  }
};

export default AppController;