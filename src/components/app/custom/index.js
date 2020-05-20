/**
 * Created by sean@ihuanqu.com on 2019/3/21.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import configs from "../../../common/configs";

import {Input,Button} from "../../../components/vendors";

export default class Custom extends PureComponent{
  constructor(props){
    super(props);

    const {app:{custom}} = props.state;

    this.state = {
      name:custom.name || "",
      provider:custom.provider || "",
      networkId: custom.networkId || "",
      symbol:custom.symbol || "",
      explorer:custom.explorer || ""
    };

    this.getDisabled = this.getDisabled.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  getDisabled(){
    const {name,provider} = this.state;

    if(name && provider && configs.regular.url.test(provider)){
      return false;
    }

    return true;
  }

  onInput(e,key){
    let state = {...this.state};
    state[key] = e.target.value;

    this.setState(state);
  }

  onSave(){
    this.props.actions.saveCustom(this.state);
  }

  render(){
    const {locale,onDismiss} = this.props;

    return (
      <section className="page-custom">
        <div className="header">
          <div className="title">
            {locale.network.custom}
          </div>
          <a onClick={()=>{
            onDismiss && onDismiss();
          }}><i className="fa icon-close"/></a>
        </div>
        <div className="body content-common-wrapper">
          <section>
            <Input
              title={locale.custom_name}
              value={this.state.name}
              onChange={(e)=>{
                this.onInput(e,"name");
              }}
            />
          </section>
          <section>
            <Input
              title={locale.custom_rpc_url}
              value={this.state.provider}
              onChange={(e)=>{
                this.onInput(e,"provider");
              }}
            />
          </section>
          <section>
            <Input
              title={locale.custom_networkId}
              value={this.state.networkId}
              onChange={(e)=>{
                this.onInput(e,"networkId");
              }}
            />
          </section>
          {/*<section>*/}
          {/*  <Input*/}
          {/*    title={locale.custom_symbol}*/}
          {/*    value={this.state.symbol}*/}
          {/*    onChange={(e)=>{*/}
          {/*      this.onInput(e,"symbol");*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</section>*/}
          <section>
            <Input
              title={locale.custom_explorer_url}
              value={this.state.explorer}
              onChange={(e)=>{
                this.onInput(e,"explorer");
              }}
            />
          </section>
          <section>
            <Button
              text={locale.save}
              disabled={this.getDisabled()}
              block={true}
              onClick={this.onSave}
            />
          </section>
        </div>
      </section>
    )
  }
}