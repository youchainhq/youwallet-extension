/**
 * Created by sean@ihuanqu.com on 2019/3/14.
 */
import _ from "lodash";
import React, {PureComponent} from 'react';
import md5 from "md5";
import extensionizer from 'extensionizer';
import configs from "../../common/configs";
import Storage from "../../common/storage";
import TransactionController from "../../controllers/transaction";

import {Button,Input} from "../../components/vendors";

export default class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      password:""
    };

    this.getDisabled = this.getDisabled.bind(this);
    this.inputPassword = this.inputPassword.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  getDisabled() {
    const {password} = this.state;

    if(password && configs.regular.password.test(password)){
      return false;
    }

    return true;
  }

  inputPassword(e){
    this.setState({
      password:e.target.value
    });
  }

  validatePassword(input = false) {
    if(input && !this.state.password){
      return {
        ret: false
      }
    }

    if (configs.regular.password.test(this.state.password)) {
      return {
        ret: true
      }
    }
    else {
      if(this.state.password){
        return {
          ret: false,
          msg: this.props.locale.password_new_error
        }
      }
      else{
        return {
          ret:false
        }
      }
    }
  }

  dealPending(){
    if(!this._interval){
      this._interval = setInterval(()=>{
        const transaction = TransactionController.getNextPending();
        if(transaction){
          Storage.youchain.you.getTransaction(transaction.transactionHash).then((ret)=>{
            if(ret && ret.hash){
              let data = {
                ...transaction,
                ...ret,
                ...{
                  status: configs.txStatus.Success
                }
              };

              this.props.actions.receiptTransaction(data);
            }
            else{
              TransactionController.updateNextCheck(transaction);
            }
          }).catch(()=>{
            TransactionController.updateNextCheck(transaction);
          });
        }
        else{
          this.clearInterval();
        }
      },3000);
    }
  }

  clearInterval(){
    this._interval && clearInterval(this._interval);
    this._interval = null;
  }

  componentWillUnmount(){
    this.clearInterval();
  }

  componentWillMount() {
    if(extensionizer.storage){
      Storage.get("timer").then((timer)=>{
        let num = parseInt(timer);
        if(num > 0){
          Storage.get("password").then((password)=>{
            if(password){
              this.unLock(password);

              Storage.saveAlone("timer",num - 1);
            }
          });
        }
      });
    }
    else{
      const timer = Storage.get("timer");
      let num = parseInt(timer);
      if(num > 0){
        const password = Storage.get("password");
        if(password){
          this.unLock(password);

          Storage.saveAlone("timer",num - 1);
        }
      }
    }
  }

  unLock(password,submit = false){
    const {locale} = this.props;

    Storage.unlock(password).then((ret)=>{
      if(ret.msg){
        this.props.onShowMsg(locale.password_error,"error");
      }
      else{
        let activeNetWork = {...configs.networks[Storage.currentNetwork]};

        if(Storage.currentNetwork === "custom"){
          activeNetWork = {
            ...activeNetWork,
            ...Storage.custom
          }
        }

        this.props.actions.initStore({
          app:{
            network:activeNetWork,
            custom:Storage.custom
          },
          token:{
            list:Storage.tokens,
            current:Storage.currentToken
          },
          account:{
            list:Storage.accounts,
            current:Storage.currentAccount
          },
          transaction:{
            list:Storage.transactions,
            pending:Storage.pendingTransactions
          }
        });

        const tokens = _.filter(Storage.tokens,(item)=>{
          return item.network === Storage.currentNetwork
        });

        if(tokens){
          _.forEach(tokens,(token,idx)=>{
            if(token.base){
              _.delay(()=>{
                this.props.actions.getBalance({
                  accountAddress:token.accountAddress,
                  tokenId:token.tokenId
                });
              },idx * 500);
            }
            else{
              if(token.accountAddress === Storage.currentAccount){
                _.delay(()=>{
                  this.props.actions.getTokenBalance({
                    accountAddress:token.accountAddress,
                    tokenAddress:token.address,
                    tokenId:token.tokenId
                  });
                },idx * 500);
              }
            }
          });
        }

        this.dealPending();

        if(submit){
          Storage.saveAlone("password",md5(this.state.password));
          Storage.saveAlone("timer",configs.passwordTimer);
        }
      }
    });
  }

  onSubmit(){
    let [vp] = [
      this.validatePassword(true)
    ];

    if(!vp.ret){
      this.refs.password.onBlur();
      return;
    }

    this.unLock(md5(this.state.password),true);
  }

  onEnter(e) {
    if (e.keyCode === 13) {
      e.preventDefault();

      this.onSubmit();
    }
  }

  render() {
    const {locale,onRoute} = this.props;

    return (
      <section className="page-login">
        <img src={`${configs.imgPre}logo-lg.png?t=20191111001`} className="logo"/>
        <article>
          <h1>{locale.welcome}</h1>
          <div>{locale.welcome_desc}</div>
        </article>
        <div className="action-wrapper">
          <Input
            ref="password"
            type="password"
            placeholder={locale.login_password}
            value={this.state.password}
            onChange={this.inputPassword}
            onValidate={this.validatePassword}
            onKeyUp={this.onEnter}
          />
          <Button
            type="default"
            text={locale.login}
            block={true}
            disabled={this.getDisabled()}
            onClick={this.onSubmit}
          />
          <a onClick={()=>{
            onRoute("reset");
          }}>{locale.reset_wallet}</a>
        </div>
      </section>
    );
  }
}