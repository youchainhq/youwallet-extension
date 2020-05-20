import _ from "lodash";
import Storage from "../common/storage";
import Utils from "../common/utils";
import configs from "../common/configs";

const AccountController = {
  create(data){
    const account = Utils.getAccountAtIndex(data.mnemonic);

    if(data.password){
      Storage.authenticate(data.password);
      Storage.save();
    }

    const newAccount = {
      type:configs.ACCOUNT_TYPE.MNEMONIC,
      address: account.address,
      privateKey: account.privateKey,
      mnemonic:data.mnemonic,
      name:data.name
    };

    Storage.createAccount(newAccount);

    return newAccount;
  },

  import(data){
    let account;

    switch (data.type){
      case configs.ACCOUNT_TYPE.PRIVATE_KEY:
        account = Storage.youchain.you.accounts.privateKeyToAccount(data.privateKey);
        break;
      case configs.ACCOUNT_TYPE.MNEMONIC:
        account = Utils.getAccountAtIndex(data.mnemonic);
        break;
      case configs.ACCOUNT_TYPE.KEY_STORE:
        account = Storage.youchain.you.accounts.decrypt(data.keystore,data.password);
        break;
    }

    let newAccount = {
      ...data,
      ...{
        address:account.address,
        privateKey:account.privateKey,
        name:`Account${_.keys(Storage.accounts).length + 1}`
      }
    };

    Storage.createAccount(newAccount);

    return newAccount;
  },

  get(address){
    return Storage.accounts[address];
  },

  switch(address){
    Storage.switchAccount(address);
  },

  remove(address){
    return Storage.deleteAccount(address);
  },

  update(data){
    Storage.updateAccount(data);
  }
};

export default AccountController;