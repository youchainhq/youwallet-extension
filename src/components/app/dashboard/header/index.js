/**
 * Created by sean@ihuanqu.com on 2019/3/5.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import copy from "copy-to-clipboard";
import classnames from 'classnames';
import Utils from "../../../../common/utils";

import {Confirm} from "../../../../components/vendors";

import Menu from "./menu";
import More from "./more";

import AccountModal from "../../../../components/app/account/modal";
import PrivateKeyModal from "../../../../components/app/account/privateKey";

export default class Header extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      menu:false,
      more:false,
      remove:false,
      accountModal:false,
      privateKeyModal:false
    };

    this.onCopy = this.onCopy.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onShowAccount = this.onShowAccount.bind(this);
    this.onShowPrivateKey = this.onShowPrivateKey.bind(this);
  }

  onCopy(value){
    const {locale} = this.props;
    copy(value);

    this.props.onShowMsg(locale.copy_success,"success");
  }

  onRemove(){
    this.setState({
      remove:false
    });

    const {account:{current}} = this.props.state;
    this.props.actions.removeAccount(current);
  }

  onShowAccount(){
    this.setState({
      menu:false,
      more:false,
      accountModal:true
    });
  }

  onShowPrivateKey(){
    this.setState({
      accountModal:false,
      privateKeyModal:true
    });
  }

  render(){
    const {state,locale,actions,onRoute,onShowMsg} = this.props;
    const {account,app:{network}} = this.props.state;

    const current = account.list[account.current];

    const menuClass = classnames({
      "menu-wrapper":true,
      "animated":true,
      "fadeInLeft":this.state.menu,
      "fadeOutLeft":!this.state.menu
    });

    const moreClass = classnames({
      "more-wrapper":true,
      "animated":true,
      "fadeIn":this.state.more,
      "fadeOut":!this.state.more
    });

    const maskClass = classnames({
      "mask":true,
      "menu":this.state.menu
    });

    return (
      <div className="dashboard-header-wrapper">
        <div className="body">
          <a className="menu" onClick={()=>{
            this.setState({
              menu:!this.state.menu
            })
          }}>
            <i className="fa icon-menu"/>
          </a>
          <a className="account" onClick={()=>{
            this.onCopy(current.address);
          }}>
            <h3>{current && current.name}</h3>
            <small>{Utils.formatAddress(current && current.address)}</small>
          </a>
          <a className="more" onClick={()=>{
            this.setState({
              more:!this.state.more
            })
          }}>
            <i className="fa icon-more"/>
          </a>
        </div>

        {
          this.state.more || this.state.menu  ?
            <div className={maskClass} onClick={()=>{
              this.setState({
                menu:false,
                more:false
              });
            }}/> : null
        }

        {
          this.state.menu ?
            <Menu
              state={state}
              locale={locale}
              actions={actions}
              onRoute={onRoute}
              onShowMsg={onShowMsg}
              menuClass={menuClass}
              onDismiss={()=>{
                this.setState({
                  menu:false
                });
              }}
              onShowAccount={this.onShowAccount}
            /> : null
        }

        {
          this.state.more ?
            <More
              state={state}
              locale={locale}
              actions={actions}
              onRoute={onRoute}
              moreClass={moreClass}
              onShowAccount={this.onShowAccount}
              onDismiss={()=>{
                this.setState({
                  more:false
                });
              }}
              onRemove={()=>{
                this.setState({
                  remove:true,
                  more:false
                })
              }}
            />: null
        }

        {
          this.state.remove ?
            <Confirm
              title={locale.account_remove_confirm}
              confirmText={locale.confirm}
              cancelText={locale.cancel}
              onConfirm={this.onRemove}
              onCancel={()=>{
                this.setState({
                  remove:false
                })
              }}
            /> : null
        }

        {
          this.state.accountModal ?
            <AccountModal
              network={network}
              data={current}
              locale={locale}
              onRoute={onRoute}
              onShowMsg={onShowMsg}
              onDismiss={()=>{
                this.setState({
                  accountModal:false
                });
              }}
              onShowPrivateKey={this.onShowPrivateKey}
            /> : null
        }

        {
          this.state.privateKeyModal ?
            <PrivateKeyModal
              data={current}
              locale={locale}
              onRoute={onRoute}
              onShowMsg={onShowMsg}
              onDismiss={()=>{
                this.setState({
                  privateKeyModal:false
                });
              }}
              onBack={()=>{
                this.setState({
                  privateKeyModal:false,
                  accountModal:true
                });
              }}
            /> : null
        }
      </div>
    )
  }
}
