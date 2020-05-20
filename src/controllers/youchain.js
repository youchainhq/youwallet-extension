import Storage from "../common/storage";

const YOUChainController = {

  async send(method, params){
    return Storage.youchain.currentProvider.send(method, params);
  },
};

export default YOUChainController;