/**
 * Created by sean@ihuanqu.com on 2019/3/18.
 */
import "./style.less";
import React,{PureComponent} from 'react';

import Account from "./account";
import Tokens from "./tokens";

export default class Menu extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {state,locale,actions,onRoute,onShowMsg,menuClass,onDismiss,onShowAccount} = this.props;

    return (
      <div className={menuClass}>
        <section>
          <a onClick={()=>{
            onDismiss && onDismiss();
          }}><i className="fa icon-close"/></a>
          <Account
            state={state}
            locale={locale}
            actions={actions}
            onRoute={onRoute}
            onShowMsg={onShowMsg}
            onDismiss={onDismiss}
            onShowAccount={onShowAccount}
          />
        </section>
        <Tokens
          state={state}
          locale={locale}
          actions={actions}
          onRoute={onRoute}
          onDismiss={onDismiss}
        />
        <section>
          <a onClick={()=>{
            onRoute("token");
          }}>{locale.token_add}</a>
        </section>
      </div>
    )
  }
}
