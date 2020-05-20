/**
 * Created by sean@ihuanqu.com on 2019/3/20.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import {fromLu} from "youchain-utils";
import Utils from "../../../../common/utils";

import {Input,Button,Select} from "../../../../components/vendors";
import _ from "lodash";
import configs from "../../../../common/configs";

export default class Form extends PureComponent{
  constructor(props){
    super(props);

    this._gasOptions = [...configs.gasOptions];

    this.state = {
      to:"",
      num:"",
      gas:this._gasOptions[0],
      data:null
    };

    this.getDisabled = this.getDisabled.bind(this);

    this.inputTo = this.inputTo.bind(this);
    this.inputNum = this.inputNum.bind(this);
    this.selectGas = this.selectGas.bind(this);
    this.setData = this.setData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const {locale} = this.props;
    const {app:{usd},token} = this.props.state;
    const currentToken = _.find(token.list,["tokenId",token.current]);
    let gasLimit = currentToken.base ? configs.gasLimit.base : configs.gasLimit.token;

    _.forEach(this._gasOptions,(item)=>{
      const value = fromLu((item.value * gasLimit).toString(),"glu");
      item.label = locale.gas_types[item.key];
      item.summary = {
        title:`${value} YOU`,
        desc:`${Utils.formatUsd(usd,value,7)} USD`
      }
    });

    this.setState({
      gas:this._gasOptions[0]
    });
  }

  getDisabled(){
    const {to,num} = this.state;

    if(to && num){
      return false;
    }

    return true;
  }

  inputTo(e){
    this.setState({
      to:e.target.value
    });
  }

  inputNum(e){
    this.setState({
      num:e.target.value
    });
  }

  selectGas(gas){
    this.setState({
      gas
    });
  }

  setData(data){
    this.setState({
      data:data
    });
  }

  onSubmit(){
    const {to,num,gas,data} = this.state;
    const {token} = this.props.state;
    const currentToken = _.find(token.list,["tokenId",token.current]);

    let gasPrice = 0;
    let gasLimit = currentToken.base ? configs.gasLimit.base : configs.gasLimit.token;

    if(data){
      gasPrice = data.price;
    }
    else{
      gasPrice = gas.value;
    }

    this.props.onSubmit({
      to:to,
      num:num,
      gasPrice:gasPrice,
      gasLimit:gasLimit
    });
  }

  render(){
    const {locale,language,onShowGas} = this.props;
    const {app:{usd},account,token} = this.props.state;
    const currentAccount = account.list[account.current];
    const currentToken = _.find(token.list,["tokenId",token.current]);

    const balance = Utils.formatAccuracy(currentToken.balance || 0,currentToken.decimal);

    let gasValue = 0,gasUsd = 0;

    if(this.state.data){
      gasValue = fromLu((this.state.data.price * this.state.data.limit).toString(),"glu");
      gasUsd = Utils.formatUsd(usd,gasValue,7);
    }

    return (
      <div className={`content-common-wrapper turnOut-form-wrapper ${language}`}>
        <section>
          <div className="form-wrapper">
            <div className="form-title">{locale.from}</div>
            <div className="form-from">
              <section className="overflow">{currentAccount.name}</section>
              <section>{balance.toFixed(4)} {currentToken.symbol}</section>
              {
                currentToken.base ? <section>{Utils.formatUsd(usd,balance)} USD</section> : null
              }
            </div>
          </div>
          <div className="form-wrapper">
            <div className="form-title">&nbsp;{locale.to}</div>
            <Input
              placeholder={locale.to_placeholder}
              value={this.state.to}
              onChange={this.inputTo}
            />
          </div>
          <div className="form-wrapper">
            <div className="form-title">{locale.count}</div>
            <Input
              placeholder={currentToken.symbol}
              value={this.state.num}
              onChange={this.inputNum}
            />
          </div>
          <div className="form-wrapper gas">
            <div className="form-title">{locale.gas}</div>
            {
              this.state.data ? <div className="gas-diy">
                <section>
                  <h4>{gasValue} YOU</h4>
                  <small>{gasUsd} USD</small>
                </section>
                <section>
                  <a onClick={()=>{
                    this.setState({
                      data:null
                    });
                  }}>{locale.gas_reset}</a>
                </section>
              </div> : <Select
                options={this._gasOptions}
                defaultOption={this.state.gas}
                onChange={this.selectGas}
              />
            }
          </div>
          {
            this.state.data ? null : <div className="gas-options-wrapper">
              <a onClick={()=>{
                onShowGas && onShowGas(parseFloat(this.state.num || 0));
              }}>{locale.advanced_options}</a>
            </div>
          }
        </section>
        <section>
          <Button
            text={locale.next}
            disabled={this.getDisabled()}
            block={true}
            onClick={this.onSubmit}
          />
        </section>
      </div>
    )
  }
}