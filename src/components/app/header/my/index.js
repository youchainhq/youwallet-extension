/**
 * Created by sean@ihuanqu.com on 2019/3/18.
 */
import "./style.less";
import _ from "lodash";
import React,{PureComponent} from 'react';
import Storage from "../../../../common/storage";
import Utils from "../../../../common/utils";

export default class My extends PureComponent{
  constructor(props){
    super(props);

    this.onSwitch = this.onSwitch.bind(this);
  }

  onSwitch(accountAddress){
    this.props.actions.switchAccount(accountAddress);

    const tokens = _.filter(Storage.tokens,(item)=>{
      return item.network === Storage.currentNetwork && item.accountAddress === accountAddress
    });

    if(tokens){
      _.forEach(tokens,(token,idx)=>{
        if(token.base){
          _.delay(()=>{
            this.props.actions.getBalance({
              accountAddress:accountAddress,
              tokenId:token.tokenId
            });
          },idx * 500);
        }
        else{
          _.delay(()=>{
            this.props.actions.getTokenBalance({
              accountAddress:accountAddress,
              tokenAddress:token.address,
              tokenId:token.tokenId
            });
          },idx * 500);
        }
      });
    }
  }

  render(){
    const {locale,onRoute,myClass,onShowSettings,onDismiss} = this.props;

    const {account:{list,current}} = this.props.state;

    return (
      <ul className={myClass}>
        <li>
          <div>{locale.account_my}</div>
          <a onClick={()=>{
            this.props.actions.signOut();
          }}>{locale.logout}</a>
        </li>
        <li>
          {
            list && _.keys(list).map((item,key)=>{
              return (
                <a key={key} onClick={()=>{
                  this.onSwitch(item);
                  onDismiss && onDismiss();
                }}>
                  <span>
                    {
                      item === current ? <i className="fa icon-checked"/> : null
                    }
                  </span>
                  <h4>
                    <div>{list[item].name}</div>
                    <small>{Utils.formatAccuracy(list[item].balance || 0).toFixed(4)} YOU</small>
                  </h4>
                </a>
              )
            })
          }
        </li>
        <li>
          <a onClick={()=>{
            onRoute("account");
            onDismiss && onDismiss();
          }}>
            <i className="fa icon-plus"/>
            {locale.account_create}
          </a>
        </li>
        <li>
          <a onClick={()=>{
            onRoute("account",{idx:1});
            onDismiss && onDismiss();
          }}>
            <i className="fa icon-download"/>
            {locale.account_import}
          </a>
        </li>
        <li>
          <a onClick={()=>{
            onShowSettings && onShowSettings();
            onDismiss && onDismiss();
          }}>
            <i className="fa icon-setting"/>
            {locale.setting}
          </a>
        </li>
      </ul>
    )
  }
}
