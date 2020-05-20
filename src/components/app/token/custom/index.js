/**
 * Created by sean@ihuanqu.com on 2019/3/19.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import TokenController from "../../../../controllers/token";

import {Input,Button} from "../../../../components/vendors"

export default class Custom extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      address:"",
      symbol:"",
      decimal:""
    };

    this.inputAddress = this.inputAddress.bind(this);
    this.searchToken = this.searchToken.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getDisabled(){
    const {address,symbol,decimal} = this.state;

    if(address && symbol && decimal){
      return false;
    }

    return true;
  }

  inputAddress(e){
    this.setState({
      address:e.target.value.trim()
    });
  }

  searchToken(){
    if(this.state.address){
      TokenController.search(this.state.address).then((token)=>{
        this.setState({
          ...token
        });
      }).catch((error)=>{
        this.props.onShowMsg(error.message,"error");
      });
    }
  }

  onSubmit(){
    const {address,symbol,decimal} = this.state;
    if(address && symbol && decimal){
      if(TokenController.exists({
        address:address
      })){
        this.props.onShowMsg(this.props.locale.token_exist,"error");
        return;
      }

      const data = TokenController.format(this.state);

      this.props.actions.createToken(data);
    }
  }

  render(){
    const {locale} = this.props;

    return (
      <div className="content-common-wrapper custom-wrapper">
        <section>
          <section>
            <Input
              title={locale.token_address}
              value={this.state.address}
              onChange={this.inputAddress}
              onBlur={this.searchToken}
            />
          </section>
          <section>
            <Input
              title={locale.token_symbol}
              value={this.state.symbol}
            />
          </section>
          <section>
            <Input
              title={locale.token_decimal}
              value={this.state.decimal}
            />
          </section>
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