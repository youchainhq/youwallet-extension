import Storage from "../common/storage";

const TransactionController = {
  async sign(data,privateKey){
    return await Storage.youchain.you.accounts.signTransaction(data,privateKey);
  },

  send(data){
    return Storage.youchain.you.sendSignedTransaction(data);
  },

  addPending(data){
    Storage.addPendingTransaction(data);
  },

  removePending(transactionHash){
    Storage.removePendingTransaction(transactionHash);
  },

  add(data){
    Storage.addTransaction(data);
  },

  clear(){
    Storage.clearTransaction();
  },

  getNextPending(){
    return Storage.getNextPendingTransaction();
  },

  updateNextCheck(data){
    Storage.updatePendingTransactionNextCheck(data);
  },

  async getTransactionCount(address){
    return await Storage.youchain.you.getTransactionCount(address);
  },

  async getGasPrice(){
    return await Storage.youchain.you.getGasPrice();
  },

  async estimateGas(data){
    return await Storage.youchain.you.estimateGas(data);
  }
};

export default TransactionController;