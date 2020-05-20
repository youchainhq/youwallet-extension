/**
 * Created by sean@ihuanqu.com on 2019/3/5.
 */
import "./style.less";
import _ from "lodash";
import React,{PureComponent} from 'react';
import Utils from "../../../../common/utils";

import {Button} from "../../../../components/vendors";

export default class Account extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {locale,onRoute} = this.props;
    const {app:{usd},token} = this.props.state;
    const currentToken = _.find(token.list,["tokenId",token.current]);

    if(!currentToken){
      return null;
    }

    const balance = Utils.formatAccuracy(currentToken.balance || 0,parseInt(currentToken.decimal));

    return (
      <div className="dashboard-account-wrapper">
        <img src={currentToken.icon}/>
        <section className="summary">
          <h1>{balance.toFixed(4)} {currentToken.symbol}</h1>
          {
            currentToken.base ? <small>{Utils.formatUsd(usd,balance)} USD</small> : null
          }
        </section>
        <section className="actions">
          {
            currentToken.base ? <Button
              text={locale.deposit}
              onClick={()=>{
                onRoute("deposit");
              }}
            /> : null
          }
          <Button
            text={locale.send}
            onClick={()=>{
              onRoute("turnOut");
            }}
          />
        </section>
      </div>
    )
  }
}
