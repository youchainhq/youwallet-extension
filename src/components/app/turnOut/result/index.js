/**
 * Created by sean@ihuanqu.com on 2019/3/20.
 */
import "./style.less";
import _ from "lodash";
import React,{PureComponent} from 'react';
import {fromLu} from "youchain-utils";
import Utils from "../../../../common/utils";

import {Button} from "../../../../components/vendors";

export default class Result extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {locale,data:{to,num,gasPrice,gasLimit},onShowMsg,onSubmit} = this.props;
    const {app:{usd},account,token} = this.props.state;
    const currentAccount = account.list[account.current];
    const currentToken = _.find(token.list,["tokenId",token.current]);

    let total;

    const balance = Utils.formatAccuracy(currentAccount.balance || 0);
    const gas = fromLu((gasPrice * gasLimit).toString(),"glu");

    if(currentToken.base){
      total = `${parseFloat(gas) + parseFloat(num)}`;
    }
    else{
      total = `${num} ${currentToken.symbol} + ${gas}`
    }

    return (
      <div className="content-common-wrapper turnOut-result-wrapper">
        <section>
          <div>
            <section>{locale.from}</section>
            <section>
              <h4 className="overflow">{currentAccount.name}</h4>
              <small className="address">{Utils.formatAddress(currentAccount.address,false)}</small>
            </section>
          </div>
          <div>
            <section>{locale.to}</section>
            <section>
              <small className="address">{Utils.formatAddress(to,false)}</small>
            </section>
          </div>
          <div>
            <section>{locale.count}</section>
            <section>
              <h4>{num} {currentToken.symbol}</h4>
              {
                currentToken.base ? <small>{Utils.formatUsd(usd,num,7)} USD</small> : null
              }
            </section>
          </div>
          <div>
            <section>{locale.gas}</section>
            <section>
              <h4>{gas} YOU</h4>
              <small>{Utils.formatUsd(usd,gas,7)} USD</small>
            </section>
          </div>
          <div>
            <section>{locale.turnOut_total}</section>
            <section>
              <h4>{total} YOU</h4>
              {
                currentToken.base ? <small>{Utils.formatUsd(usd,total,7)} USD</small> : null
              }
            </section>
          </div>
        </section>
        <section>
          <Button
            text={locale.turnOut_submit}
            block={true}
            onClick={()=>{
              if(balance - total < 0){
                onShowMsg && onShowMsg(locale.insufficient_funds,"info");
              }
              else{
                onSubmit && onSubmit();
              }
            }}
          />
        </section>
      </div>
    )
  }
}