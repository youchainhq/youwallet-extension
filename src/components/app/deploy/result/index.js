/**
 * Created by sean@ihuanqu.com on 2019/3/20.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import {fromLu} from "youchain-utils";
import popup from "../../../../popup";
import Utils from "../../../../common/utils";

import {Button} from "../../../../components/vendors";
import Tab from "../../../../components/common/tab";

export default class Result extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      idx:0
    };

    this.onChangeTab = this.onChangeTab.bind(this);
  }

  onChangeTab(idx){
    this.setState({
      idx
    });
  }

  render(){
    const {locale,data:{gasPrice,gasLimit,data,value},onShowMsg,onSubmit,onShowGas} = this.props;
    const {app:{usd},account} = this.props.state;
    const currentAccount = account.list[account.current];

    const {idx} = this.state;

    const tabs = [
      {
        title:locale.deploy_detail
      },
      {
        title:locale.deploy_data
      }
    ];

    const balance = Utils.formatAccuracy(currentAccount.balance || 0);

    console.log("gasPrice: ", gasPrice);
    console.log("gasLimit: ", gasLimit);

    const gas = fromLu((gasPrice * gasLimit).toString(),"you");
    const used = gas + (value ? value : 0);

    return (
      <div className="content-common-wrapper deploy-result-wrapper">
        <Tab
          data={tabs}
          onChange={this.onChangeTab}
          defaultIdx={idx}
        />
        {
          idx === 0 ?
            <section className="detail-region">
              <div>
                <section>{locale.from}</section>
                <section>
                  <h4 className="overflow">
                    {currentAccount.name}
                    <small>({balance.toFixed(4)} YOU)</small>
                  </h4>
                  <small className="address">{Utils.formatAddress(currentAccount.address,false)}</small>
                </section>
              </div>
              {
                value && Math.abs(value) > 0 ?
                  <div>
                    <section>{locale.count}</section>
                    <section>
                      <h4>{value} YOU</h4>
                      <small>{Utils.formatUsd(usd,value,7)} USD</small>
                    </section>
                  </div> : null
              }
              <div>
                <section>{locale.gas}</section>
                <section>
                  <h4>{gas} YOU</h4>
                  <small>{Utils.formatUsd(usd,gas,7)} USD</small>
                </section>
              </div>
              <div>
                <a onClick={()=>{
                  onShowGas && onShowGas();
                }}>{locale.advanced_options}</a>
              </div>
            </section> : null
        }
        {
          idx === 1 ?
            <section className="data-region">
              <p>{locale.deploy_data_title}</p>
              <div>
                {
                  data
                }
              </div>
            </section> : null
        }
        <section className="actions-region">
          <Button
            text={locale.cancel}
            type={"default"}
            block={true}
            onClick={()=>{
              popup.messageToContent({
                method:"close"
              });
            }}
          />
          <Button
            text={locale.confirm}
            block={true}
            onClick={()=>{
              if(balance - used < 0){
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