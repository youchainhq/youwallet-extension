import "./gas.less";
import React,{PureComponent} from 'react';
import {fromLu} from "youchain-utils";
import Utils from "../../../../common/utils";

import {Input,Button} from "../../../../components/vendors";
import Gradual from "../../../../components/common/gradual";

export default class Gas extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      price:4,
      limit:props.gasLimit
    };

    this.inputPrice = this.inputPrice.bind(this);
    this.inputLimit = this.inputLimit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getDisabled(){
    const {price,limit} = this.state;

    if(price && limit){
      return false;
    }

    return true;
  }

  inputPrice(e){
    const price = e.target.value.trim();
    if(price.length){
      if(price.length > 17){
        return false;
      }

      this.setState({
        price:parseInt(price)
      });
    }
    else{
      this.setState({
        price:""
      });
    }
  }

  inputLimit(e){
    const limit = e.target.value.trim();
    if(limit.length){
      if(limit.length > 17){
        return false;
      }

      this.setState({
        limit:parseInt(limit)
      });
    }
    else{
      this.setState({
        limit:""
      });
    }
  }

  onSubmit(){
    this.props.onSave(this.state);
  }

  render(){
    const {
      locale,
      num,
      hideNum,
      usd,
      token,
      onDismiss
    } = this.props;

    const gas = fromLu((this.state.price * this.state.limit).toString(),"glu");
    let total = 0;

    if(token.base){
      total = Utils.add([parseFloat(gas),num]);
    }
    else{
      total = `${num} ${token.symbol} + ${gas}`
    }

    return (
      <div className="content-common-wrapper gas-diy-wrapper">
        <section>
          <div className="header">
            <h1>{locale.gas_diy}</h1>
            <a onClick={()=>{
              onDismiss && onDismiss();
            }}><i className="fa icon-close"/></a>
          </div>
          <div className="body">
            <div className="form-wrapper">
              <div className="form-title">
                Gas Price
                <small>(GLU)</small>
              </div>
              <Input
                value={this.state.price}
                onChange={this.inputPrice}
              />
              <Gradual
                onUp={()=>{
                  let price = this.state.price + 1;
                  if(price){
                    this.setState({
                      price
                    });
                  }
                }}
                onDown={()=>{
                  let price = this.state.price - 1;
                  if(price){
                    this.setState({
                      price
                    });
                  }
                }}
              />
            </div>
            <div className="form-wrapper">
              <div className="form-title">
                Gas Limit
              </div>
              <Input
                value={this.state.limit}
                onChange={this.inputLimit}
              />
              <Gradual
                onUp={()=>{
                  let limit = this.state.limit + 1;
                  if(limit){
                    this.setState({
                      limit
                    });
                  }
                }}
                onDown={()=>{
                  let limit = this.state.limit - 1;
                  if(limit){
                    this.setState({
                      limit
                    });
                  }
                }}
              />
            </div>
            {
              hideNum ? null :
                <div className="form-wrapper">
                  <div className="form-title">
                    {locale.count}
                  </div>
                  <div className="text">
                    {num} {token.symbol}
                    {
                      token.base ? <small>{Utils.formatUsd(usd,num,7)} USD</small> : null
                    }
                  </div>
                </div>
            }
            <div className="form-wrapper">
              <div className="form-title">
                {locale.gas}
              </div>
              <div className="text">
                {gas} YOU
                <small>{Utils.formatUsd(usd,gas,7)} USD</small>
              </div>
            </div>
            {
              hideNum ? null :
              <div className="form-wrapper">
                <div className="form-title">
                  {locale.gas_total}
                  <small>{locale.gas_total_bak}</small>
                </div>
                <div className="text total">
                  {total} YOU
                  {
                    token.base ? <small>{Utils.formatUsd(usd,total,7)} USD</small> : null
                  }
                </div>
              </div>
            }
          </div>
        </section>
        <section>
          <Button
            text={locale.save}
            disabled={this.getDisabled()}
            block={true}
            onClick={this.onSubmit}
          />
        </section>
      </div>
    )
  }
}