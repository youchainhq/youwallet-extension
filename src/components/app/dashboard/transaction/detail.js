/**
 * Created by sean@ihuanqu.com on 2019/3/15.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import {fromLu} from "youchain-utils";
import extensionizer from 'extensionizer';
import Utils from "../../../../common/utils";
import popup from "../../../../popup";

export default class Detail extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {locale,network,usd,data,token} = this.props;

    const value = Utils.formatAccuracy(parseInt(data.value || 0),parseInt(token.decimal)) || 0;
    const gasPrice = fromLu(parseInt(data.gasPrice).toString(),"glu");
    const gasLimit = data.gas;
    const total = Utils.add([token.base ? value : 0,Utils.formatAccuracy(gasPrice * (data.status === 3 ? data.gasUsed : gasLimit),9)]);

    return (
      <div className="detail-wrapper">
        <section className="title">
          <div>{locale.detail}</div>
          {
            network.explorer ? <a onClick={()=>{
              const url = `${network.explorer}/transaction/detail/${data.transactionHash}?locale=${locale.key}`;
              if(extensionizer.storage){
                popup.messageToBackground("redirect",{url:url});
              }
              else{
                window.open(url);
              }
            }}>
              <i className="fa icon-link"/>
              {locale.view_more}
            </a> : null
          }
        </section>
        <section className="body">
          <article>
            <span>{Utils.formatAddress(data.from,false,true)}</span>
            <i className="fa icon-arrow-right"/>
            <span>{Utils.formatAddress(data.to,false,true)}</span>
          </article>
          <article>
            <h4>Transaction</h4>
            <section>
              <section>
                <div>{locale.count}</div>
                {
                  token.base ?
                    <div>{value} {token.symbol}</div> :
                    <div>0 YOU</div>
                }
              </section>
              <section>
                <div>Gas Limit(Units)</div>
                <div>{gasLimit}</div>
              </section>
              {
                data.status === 3 ?
                  <section>
                    <div>Gas Used(Units)</div>
                    <div>{parseInt(data.gasUsed || 0)}</div>
                  </section> : null
              }
              <section>
                <div>Gas Price(GLU)</div>
                <div>{gasPrice}</div>
              </section>
              <section>
                <div>{locale.total}</div>
                <div>{total} YOU</div>
              </section>
              <section>
                -{Utils.formatUsd(usd,total,7)} USD
              </section>
            </section>
          </article>
          {/*<article>*/}
            {/*<h4>Activity Log</h4>*/}
            {/*<section>*/}
              {/*<section>*/}
                {/*<div><i className="fa icon-submit"/></div>*/}
                {/*<div>Transaction created awith value of 0/0001 ETH at 16:10on 2/19/2019.</div>*/}
              {/*</section>*/}
              {/*<section>*/}
                {/*<div><i className="fa icon-submit"/></div>*/}
                {/*<div>Transaction created awith value of 0/0001 ETH at 16:10on 2/19/2019.</div>*/}
              {/*</section>*/}
              {/*<section>*/}
                {/*<div><i className="fa icon-submit"/></div>*/}
                {/*<div>Transaction at16:10 on 2/19/2019.</div>*/}
              {/*</section>*/}
            {/*</section>*/}
          {/*</article>*/}
        </section>
      </div>
    )
  }
}