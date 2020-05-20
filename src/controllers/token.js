import _ from "lodash";
import { BigNumber } from "bignumber.js/bignumber";
import Storage from "../common/storage";
import Utils from "../common/utils";
import configs from "../common/configs";

const TokenController = {
  async getBalance(accountAddress){
    return await Storage.youchain.you.getBalance(accountAddress);
  },

  async getTokenBalance(data){
    const contract = Storage.youchain.you.Contract(JSON.parse(configs.abi), data.address);
    return await contract.methods.balanceOf(data.accountAddress).call();
  },

  getContractData(data){
    const value = new BigNumber(Utils.reverseAccuracy(data.value,data.decimal)).toString();
    const contract = Storage.youchain.you.Contract(JSON.parse(configs.abi), data.address);
    return contract.methods.transfer(data.toAddress,value).encodeABI();
  },

  async search(address){
    const contract = Storage.youchain.you.Contract(JSON.parse(configs.abi), address);
    const name = await contract.methods.name.call();
    const symbol = await contract.methods.symbol.call();
    const decimal = await contract.methods.decimals.call();

    return {
      address,
      name,
      symbol,
      decimal,
      icon:"https://static.iyouchain.com/extension/images/icon/default.png"
    }
  },

  getTokenId(){
    return Storage.getTokenId();
  },

  getInitToken(accountAddress){
    return Storage.getInitToken(accountAddress);
  },

  get(tokenId){
    return Storage.getToken(tokenId);
  },

  exists(address){
    return Storage.existsToken(address);
  },

  format(data){
    const tokenId = Storage.getTokenId(data.address);

    return {
      ...data,
      ...{
        tokenId:tokenId,
        accountAddress:Storage.currentAccount,
        network:Storage.currentNetwork
      }
    }
  },

  create(data){
    Storage.createToken(data);
  },

  switch(tokenId){
    Storage.switchToken(tokenId);
  },

  remove(tokenId){
    return Storage.deleteToken(tokenId);
  },

  update(data){
    Storage.updateToken(data);
  }
};

export default TokenController;