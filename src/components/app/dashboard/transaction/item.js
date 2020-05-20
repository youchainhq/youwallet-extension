/**
 * Created by sean@ihuanqu.com on 2019/3/15.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import moment from "moment";
import Utils from "../../../../common/utils";
import Detail from "./detail";

export default class Item extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      open:false
    }
  }

  render(){
    const {locale,network,usd,token,data} = this.props;

    const num = Utils.formatAccuracy(data.value,data.decimal);

    let action = '';

    if(data.method){
      action = data.method;
    }
    else{
      if(data.to === "New Contract"){
        action = locale.deploy_title;
      }
      else{
        action = `${locale.transactions_sent} ${token.symbol}`;
      }
    }

    return (
      <div className="item-wrapper">
        <a onClick={()=>{
          this.setState({
            open:!this.state.open
          });
        }}>
          <section>
            <div>#{moment(data.createdAt).format("YYYY-MM-DD HH:mm")}</div>
            {
              data.to === "New Contract" ? null : <div className={`title-status title-${data.status}`}>{locale.turnOut}</div>
            }
          </section>
          <section>
            <div>{action}</div>
            <div>-{num || 0} {token.symbol}</div>
          </section>
          <section>
            <div className={`status-${data.status}`}>{locale.transactions_status[data.status]}</div>
            {
              token.base && data.num ? <div>-{Utils.formatUsd(usd,num,7)} USD</div> : null
            }
          </section>
        </a>
        {
          this.state.open ? <Detail network={network} usd={usd} data={data} token={token} locale={locale}/> : null
        }
      </div>
    )
  }
}