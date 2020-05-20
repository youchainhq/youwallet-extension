/**
 * Created by sean@ihuanqu.com on 2019/2/14.
 */
import _ from "lodash";
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classnames from "classnames";
import extensionizer from 'extensionizer';
import popup from "../popup";
import * as actions from '../actions';
import configs from "../common/configs";
import Storage from "../common/storage";
import zh_CN from "../locales/zh_CN";
import en_US from "../locales/en_US";

import YOUChainController from "../controllers/youchain";

import Toast from '../components/vendors/toast';
import Header from "../components/app/header";
import Settings from "../components/app/settings";
import Custom from "../components/app/custom";

import Start from "./pages/start";
import Login from "./pages/login";
import Password from "./pages/password";
import Mnemonic from "./pages/mnemonic";
import Reset from "./pages/reset";
import Dashboard from "./pages/dashboard";
import Token from "./pages/token";
import Account from "./pages/account";
import TurnOut from "./pages/turnOut";
import Deploy from "./pages/deploy";
import Deposit from "./pages/deposit";

class App extends Component {
  constructor(props) {
    super(props);

    const language = navigator.language.toLocaleLowerCase() === 'zh-cn' ? 'zh' : 'en';
    this._locale = language === "zh" ? zh_CN : en_US;

    this._inited = false;

    this.state = {
      route:"start",
      params:null,
      language:language,
      settings:false,
      custom:false
    };

    this.onRoute = this.onRoute.bind(this);
    this.onShowMsg = this.onShowMsg.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
    this.onShowSettings = this.onShowSettings.bind(this);
    this.onChangeNetwork = this.onChangeNetwork.bind(this);
    this.onShowCustom = this.onShowCustom.bind(this);
  }

  componentWillMount(){
    if(extensionizer.storage){
      Storage.get("locale").then((language)=>{
        if(language){
          this._locale = language === "zh" ? zh_CN : en_US;

          this.setState({
            language
          });
        }
      });

      Storage.dataExist().then((ret)=>{
        this.onRoute(ret ? "login" : "start");
      });
    }
    else{
      const language = Storage.get("locale");

      if(language){
        this._locale = language === "zh" ? zh_CN : en_US;

        this.setState({
          language
        });
      }

      if(!_.isEmpty(Storage.get("accounts"))){
        this.onRoute("login");
      }
      else{
        this.onRoute("start");
      }
    }
  }

  componentDidMount() {
    fetch(
      "https://api.iyouchain.com/api/common/price/you",{
        mode:"cors"
      }).then(response=>{
      return response.json();
    }).then(json=>{
      if(json.ret === 0){
        this.props.actions.setUsd(json.data ? json.data.usd : 0);
      }
      else{
        this.onShowMsg(json.msg,"error");
      }
    }).catch(error =>{
      this.onShowMsg(error.toString(),"error");
    });
  }

  onRoute(key,params = null){
    this.setState({
      route:key,
      params:params
    });
  }

  onShowMsg(msg,type = "error"){
    this.props.actions.showToast({
      type:actions.types.SHOW_TOAST,
      data:{
        type:type,
        msg:msg
      }
    });
  }

  setLanguage(value){
    this.setState({
      language:value
    });

    this._locale = value === "zh" ? zh_CN : en_US;

    Storage.saveLocale(value);
  }

  onChangeNetwork(network){

    this.props.actions.switchNetwork(network);

    const tokens = _.filter(Storage.tokens,(item)=>{
      return item.network === network.key
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
            },idx * 500)
          }
        }
      });
    }

    if(extensionizer.storage){
      popup.messageToContent({
        method:"switch_network",
        params:network
      });
    }
  }

  onShowSettings(){
    this.setState({
      settings:true
    });
  }

  onShowCustom(){
    this.setState({
      custom:true
    });
  }

  handleRequestAccount(data){
    const {account,app:{network}} = this.props.state;

    if(account.current){
      let accounts = [];

      _.forEach(account.list,(item)=>{
        accounts.push({
          address:item.address,
          balance:item.balance
        });
      });

      if(extensionizer.storage){
        popup.messageToContent({
          method:data.method,
          params:{
            activeAccount:account.current,
            accounts:accounts,
            network:network
          }
        });

        _.delay(()=>{
          popup.messageToContent({
            method:"close"
          });
        },500);
      }

      this.onRoute("dashboard");
    }
  }

  componentWillReceiveProps(props) {
    const { ui: { type, request, data,meta } } = props.state;

    switch (type) {
      case actions.types.REQUEST_SUCCESSFUL:
        this.requestDidSuccess(request, data,meta);
        break;
      case actions.types.REQUEST_FAILED:
      case actions.types.SHOW_TOAST:
        if(data.msg){
          this.refs.toast.addItem({
            type:data.type || "error",
            msg:data.msg
          });

          _.delay(()=>{
            this.props.actions.clearToast({
              type:actions.types.CLEAR_TOAST
            });
          },2000);
        }
        break;
      case actions.types.CLEAR_TOAST:
        this.refs.toast.removeAll();
        break;
      default:
        break;
    }
  }

  requestDidSuccess(type, data,meta) {
    if(type === actions.types.CREATE_ACCOUNT ||
      type === actions.types.IMPORT_ACCOUNT
    ){
      _.delay(()=>{
        this.onRoute("dashboard");
      },300);
    }
    else if(type === actions.types.REMOVE_ACCOUNT){
      _.delay(()=>{
        const {account} = this.props.state;
        if(!account.current || _.isEmpty(account.list)){
          Storage.clear(()=>{
            this.onRoute("start");
          });
        }
      },300);
    }
    else if(type === actions.types.INIT_STORE){
      if(!this._inited){
        this._inited = true;

        _.delay(()=>{
          if(extensionizer.storage){
            Storage.get("param").then((param)=>{
              if(param){
                const data = JSON.parse(param);

                if(data.route){
                  this.onRoute(data.route,data.data);

                  Storage.storage.remove("param");
                }
                else if(data.method){
                  if(data.method === "you_requestAccounts"){
                    this.handleRequestAccount(data);
                  }
                  else{
                    YOUChainController.send(data.method,data.params);
                    this.onRoute("dashboard");
                  }

                  Storage.storage.remove("param");
                }
              }
              else{
                this.onRoute("dashboard");
              }
            });
          }
          else{
            this.onRoute("dashboard");
          }
        },300);
      }
    }
    else if(type === actions.types.SIGN_OUT){
      _.delay(()=>{
        this._inited = false;
        this.onRoute("login");
      },300);
    }
    else if(type === actions.types.SEND_TRANSACTION){
      if(meta && meta.from === "deploy"){
      }
      else{
        this.onRoute("dashboard");
      }
    }
    else if(type === actions.types.CREATE_TOKEN){
      _.delay(()=>{
        if(meta && meta.address){
          const {app:{network},token} = this.props.state;
          const contractToken = _.find(token.list,(item)=>{
            return item.network === network.key && item.address === meta.address;
          });

          if(contractToken){
            this.props.actions.switchToken(contractToken.tokenId);
          }
        }
        else{
          this.onRoute("dashboard");
        }
      },300);
    }
    else if(type === actions.types.CLEAR_TRANSACTION){
      this.onShowMsg(this._locale.transactions_clear_success,"success");
    }
    else if(type === actions.types.SAVE_CUSTOM){
      this.onShowMsg(this._locale.custom_save_success,"success");
      _.delay(()=>{
        this.setState({
          custom:false
        });

        this.onChangeNetwork({key:"custom"})
      },300);
    }
  }

  render() {
    const {ui} = this.props.state;
    const actions = this.props.actions;
    const {route} = this.state;

    const appClass = classnames({
      "app":true,
      "modal":!!this.state.settings || !! this.state.custom
    });

    return (
      <div className={appClass}>
        {
          route === "dashboard" ||
          route === "token" ||
          route === "account" ||
          route === "turnOut" ||
          route === "deploy" ||
          route === "deposit" ?
            <Header
              state={this.props.state}
              locale={this._locale}
              actions= {actions}
              onRoute={this.onRoute}
              onShowSettings={this.onShowSettings}
              onShowCustom={this.onShowCustom}
              onChangeNetwork={this.onChangeNetwork}
            /> : null
        }

        {
          route === "start" ?
            <Start
              locale={this._locale}
              onRoute={this.onRoute}
            /> : null
        }

        {
          route === "login" ?
            <Login
              state={this.props.state}
              locale={this._locale}
              actions= {actions}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
            /> : null
        }

        {
          route === "password" ?
            <Password
              locale={this._locale}
              onRoute={this.onRoute}
            /> : null
        }

        {
          route === "mnemonic" ?
            <Mnemonic
              actions= {actions}
              locale={this._locale}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
              params={this.state.params}
            /> : null
        }

        {
          route === "reset" ?
            <Reset
              actions= {actions}
              locale={this._locale}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
              params={this.state.params}
            /> : null
        }

        {
          route === "dashboard" ?
            <Dashboard
              state={this.props.state}
              locale={this._locale}
              actions= {actions}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
            /> : null
        }

        {
          route === "token" ?
            <Token
              state={this.props.state}
              locale={this._locale}
              actions= {actions}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
            /> : null
        }

        {
          route === "account" ?
            <Account
              state={this.props.state}
              locale={this._locale}
              actions= {actions}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
              params={this.state.params}
            /> : null
        }

        {
          route === "turnOut" ?
            <TurnOut
              state={this.props.state}
              locale={this._locale}
              language={this.state.language}
              actions= {actions}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
              params={this.state.params}
            /> : null
        }

        {
          route === "deploy" ?
            <Deploy
              state={this.props.state}
              locale={this._locale}
              language={this.state.language}
              actions= {actions}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
              params={this.state.params}
            /> : null
        }

        {
          route === "deposit" ?
            <Deposit
              state={this.props.state}
              locale={this._locale}
              actions= {actions}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
            /> : null
        }

        {
          this.state.settings ?
            <Settings
              state={this.props.state}
              defaultLanguage={_.find(configs.languages,["key",this.state.language])}
              locale={this._locale}
              actions= {actions}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
              onDismiss={()=>{
                this.setState({
                  settings:false
                });
              }}
              setLanguage={this.setLanguage}
            /> : null
        }

        {
          this.state.custom ?
            <Custom
              state={this.props.state}
              locale={this._locale}
              actions= {actions}
              onRoute={this.onRoute}
              onShowMsg={this.onShowMsg}
              onDismiss={()=>{
                this.setState({
                  custom:false
                });
              }}
            /> : null
        }

        <Toast ref="toast"/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);