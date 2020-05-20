import _ from "lodash";
import md5 from "md5";
import extensionizer from 'extensionizer';
import YOUChain from "youchain";
import Utils from "./utils";
import configs from "./configs";

const Storage = {
  storageKeys: [
    'custom',
    'currentNetwork',
    'accounts',
    'currentAccount',
    'tokens',
    'currentToken',
    'transactions',
    'pendingTransactions'
  ],

  storage: extensionizer.storage ? extensionizer.storage.local : localStorage,

  locale:navigator.language.toLocaleLowerCase() === 'zh-cn' ? 'zh' : 'en',

  currentNetwork:"test",
  custom:{},
  youchain:new YOUChain(configs.networks.test.provider,null,{
    transactionConfirmationBlocks: 12
  }),

  accounts: {},
  currentAccount: "",
  tokens:[],
  currentToken:"",
  transactions: [],
  pendingTransactions: [],

  omitEncrypt:["locale","currentNetwork","currentAccount","currentToken"],

  ready: false,
  password: false,

  get(key) {
    if(extensionizer.storage){
      return new Promise(resolve => (
        this.storage.get(key, data => {
          if(key in data)
            return resolve(data[key]);

          resolve(false);
        })
      ));
    }
    else{
      return this.storage.getItem(key);
    }
  },

  save(...keys) {
    if(!this.ready){
      return {
        msg:"Attempted to write storage when not ready"
      }
    }

    if(!keys.length){
      keys = this.storageKeys;
    }

    _.forEach(keys,(key)=>{
      if(extensionizer.storage){
        this.storage.set({
          [key]: _.indexOf(this.omitEncrypt,key) === -1 ? Utils.encrypt(this[ key ], this.password) : this[key]
        });
      }
      else{
        this.storage.setItem(key,_.indexOf(this.omitEncrypt,key) === -1 ? Utils.encrypt(this[ key ], this.password) : this[key]);
      }
    });
  },

  saveAlone(key,value){
    if(extensionizer.storage){
      this.storage.set({
        [key]:value
      });
    }
    else{
      this.storage.setItem(key,value);
    }
  },

  clear(callback){
    if(extensionizer.storage){
      this.storage.clear(()=>{
        callback && callback();
      });
    }
    else{
      _.forEach(this.storageKeys,(key)=>{
        this.storage.removeItem(key);
      });

      callback && callback();
    }
  },

  saveLocale(value){
    this.locale = value;
    this.save('locale');
  },

  saveCustom(data){
    this.custom = data;
    this.save('custom');
  },

  saveNetwork(key){
    const network = configs.networks[key];
    if(network){
      this.currentNetwork = key;
      this.youchain.setProvider(key === "custom" ? this.custom.provider : network.provider);

      this.save('currentNetwork');
    }
  },

  async dataExist(){
    return !!(await this.get("accounts"));
  },

  async unlock(password) {
    if(this.ready) {
      return {
        msg:"ERRORS.ALREADY_UNLOCKED"
      }
    }

    if(!await this.dataExist()){
      return {
        msg:'ERRORS.NOT_SETUP'
      };
    }

    try {
      for(let i = 0; i < this.storageKeys.length; i++) {
        const key = this.storageKeys[ i ];
        const encrypted = await this.get(key);

        if(!encrypted)
          continue;

        if(_.indexOf(this.omitEncrypt,key) !== -1){
          this[key] = encrypted;

          if(key === "currentNetwork"){
            if(encrypted === "custom"){
              this.youchain.setProvider(this.custom.provider);
            }
            else{
              this.youchain.setProvider(configs.networks[encrypted].provider);
            }
          }
        }
        else{
          this[key] = Utils.decrypt(
            encrypted,
            password
          );
        }
      }
    } catch(ex) {
      return {
        msg:'ERRORS.INVALID_PASSWORD'
      };
    }

    this.password = password;
    this.ready = true;

    return false;
  },

  authenticate(password) {
    this.password = password;
    this.ready = true;
  },

  unAuthenticate(){
    this.password = "";
    this.ready = false;

    if(extensionizer.storage){
      this.storage.remove("password");
      this.storage.remove("timer");
    }
    else{
      this.storage.removeItem("password");
      this.storage.removeItem("timer");
    }
  },

  getTokenId(tokenAddress,accountAddress,networkKey){
    return md5(`${tokenAddress || configs.baseToken.address}${accountAddress || this.currentAccount}${networkKey || this.currentNetwork}`);
  },

  switchAccount(address){
    this.currentAccount = address;
    this.save("currentAccount");
  },

  createAccount(account) {
    this.accounts[account.address] = account;
    this.currentAccount = account.address;

    let tokens = this.getInitToken(account.address);

    this.currentToken = tokens.current;
    this.tokens = [...this.tokens,...tokens.list];

    this.save('accounts','currentAccount','tokens','currentToken');
  },

  deleteAccount(address) {
    delete this.accounts[address];

    _.remove(this.tokens,["accountAddress",address]);
    _.remove(this.transactions,["accountAddress",address]);
    _.remove(this.pendingTransactions,["accountAddress",address]);

    this.currentAccount = _.keys(this.accounts)[0];
    this.currentToken = this.getTokenId();

    this.save('accounts','currentAccount','tokens','currentToken', 'transactions','pendingTransactions');

    return this.currentAccount;
  },

  updateAccount(account){
    this.accounts[account.address] = account;

    this.save('accounts');
  },

  getInitToken(accountAddress){
    let tokens = [];
    let currentToken = "";

    _.forEach(_.keys(configs.networks),(networkKey)=>{
      const tokenId = this.getTokenId(null,accountAddress,networkKey);

      if(networkKey === this.currentNetwork){
        currentToken = tokenId;
      }

      tokens.push({
        ...configs.baseToken,
        ...{
          tokenId:tokenId,
          accountAddress:accountAddress,
          network:networkKey,
          base:true,
          balance:0
        }
      })
    });

    return {
      list:tokens,
      current:currentToken
    }
  },

  createToken(data) {
    this.tokens.push(data);

    this.save('tokens');
  },

  getToken(tokenId){
    return _.find(this.tokens,["tokenId",tokenId]);
  },

  existsToken(address){
    return _.find(this.tokens,(item)=>{
      return item.address === address &&
        item.accountAddress === this.currentAccount
    });
  },

  switchToken(tokenId){
    this.currentToken = tokenId;

    this.save('currentToken');
  },

  deleteToken(tokenId){
    let token = _.find(this.tokens,["tokenId",tokenId]);
    if(token && !token.base){
      _.remove(this.tokens,["tokenId",tokenId]);

      if(tokenId === this.currentToken){
        this.currentToken = this.getTokenId();

        this.save('currentToken');
      }

      this.save('tokens');
    }

    return this.currentToken;
  },

  updateToken(data){
    let token = _.find(this.tokens,["tokenId",data.tokenId]);

    if(token){
      token = {...data};

      this.save('tokens');
    }
  },

  addPendingTransaction(data) {
    if(_.find(this.pendingTransactions,["transactionHash",data.transactionHash])){
      return;
    }

    const transaction = {
      ...data,
      ...{
        nextCheck:Date.now() + 3000
      }
    };

    this.pendingTransactions = [transaction,...this.pendingTransactions];

    this.save('pendingTransactions');
  },

  removePendingTransaction(transactionHash) {
    if(_.isEmpty(this.pendingTransactions)){
      return;
    }

    _.remove(this.pendingTransactions,["transactionHash",transactionHash]);

    this.save('pendingTransactions');
  },

  getNextPendingTransaction(){
    if(_.isEmpty(this.pendingTransactions)){
      return false;
    }

    return _.find(_.orderBy(this.pendingTransactions,["nextCheck"],["desc"]),(item)=>{
      return item.nextCheck && item.nextCheck < Date.now()
    });
  },

  updatePendingTransactionNextCheck(data){
    let token = _.find(this.pendingTransactions,["tokenId",data.tokenId]);

    if(token){
      token = {
        ...data,
        ...{
          nextCheck:Date.now() + 3000
        }
      };

      this.save('pendingTransactions');
    }
  },

  addTransaction(data){
    this.transactions = [data,...this.transactions];

    this.save('transactions');
  },

  clearTransaction(){
    this.transactions = [];
    this.pendingTransactions = [];
    this.save('transactions',"pendingTransactions");
  },

  // clearSave(){
  //   this.transactions = [];
  //   this.pendingTransactions = [];
  //   this.tokens = [];
  //   this.currentToken = "";
  //   this.save('transactions',"pendingTransactions",'tokens','currentToken');
  // },
  //
  // testSave(){
  //   this.save('network','tokens','currentToken');
  // }
};

export default Storage;