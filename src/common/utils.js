import _ from "lodash";
import crypto from 'crypto';
import bip39 from "bip39";
import bip32 from "bip32";
import {BigNumber} from "bignumber.js";
import Storage from "./storage";

const Utils = {
  encryptionAlgorithm: 'aes-256-ctr',
  hashAlgorithm: 'sha256',

  hash(string) {
    return crypto.createHash(this.hashAlgorithm).update(string).digest('hex');
  },

  encrypt(data, key) {
    const encoded = JSON.stringify(data);
    const cipher = crypto.createCipher(this.encryptionAlgorithm, key);

    let crypted = cipher.update(encoded, 'utf8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
  },

  decrypt(data, key) {
    const decipher = crypto.createDecipher(this.encryptionAlgorithm, key);

    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  },

  generateMnemonic() {
    const value = bip39.generateMnemonic(128);
    const arr = value.split(" ");
    const newArr = [...new Set(arr)];

    if(arr.length === newArr.length){
      return value;
    }
    else{
      this.generateMnemonic();
    }
  },

  validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  },

  getAccountAtIndex(mnemonic, index = 0) {
    const seed = bip39.mnemonicToSeed(mnemonic);
    const node = bip32.fromSeed(seed);
    const child = node.derivePath(`m/44'/1010'/${ index }'/0/0`);
    const privateKey = child.privateKey.toString('hex');
    return Storage.youchain.you.accounts.privateKeyToAccount(`0x${privateKey}`);
  },

  formatAddress(address,short = true,middle = false){
    if(address){
      if(address.length < 15){
        return address;
      }
      if(short){
        return `${address.substr(0,6)}...${address.substr(address.length - 4,4)}`;
      }
      else{
        const len = middle ? 8 : 12;
        return `${address.substr(0,len)}...${address.substr(address.length - len,len)}`;
      }
    }

    return "";
  },

  formatUsd(usd,value,decimal = 2){
    return (parseFloat(usd) * parseFloat(value || 0)).toFixed(decimal);
  },

  add(args){
    let result = 0;

    _.forEach(args,(item)=>{
      result = item + result;
    });

    return result;
  },

  formatAccuracy(value,decimal = 18){
    return new BigNumber(value) / (new BigNumber(10).pow(decimal));
  },

  reverseAccuracy(value,decimal = 18){
    return new BigNumber(value) * (new BigNumber(10).pow(decimal));
  }
};

export default Utils;


