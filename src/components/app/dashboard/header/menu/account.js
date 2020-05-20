/**
 * Created by sean@ihuanqu.com on 2019/3/18.
 */
import "./account.less";
import React,{PureComponent} from 'react';
import copy from "copy-to-clipboard";
import configs from "../../../../../common/configs";
import Utils from "../../../../../common/utils";

import {Input} from "../../../../../components/vendors";

export default class Account extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      edit:false,
      name:""
    };

    this.inputName = this.inputName.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCopy = this.onCopy.bind(this);
  }

  inputName(e){
    this.setState({
      name:e.target.value
    });
  }

  onSubmit(){
    const {account} = this.props.state;
    const current = account.list[account.current];

    let data = {...current};
    data.name = this.state.name;

    this.props.actions.updateAccountName(data);

    this.setState({
      edit:false
    });
  }

  onCopy(){
    const {locale} = this.props;
    const {account} = this.props.state;
    const current = account.list[account.current];

    copy(current.address);

    this.props.onShowMsg(locale.copy_success,"success");
  }

  render(){
    const {locale,onShowAccount} = this.props;
    const {account} = this.props.state;
    const current = account.list[account.current];

    return (
      <div className="menu-account-wrapper">
        {
          this.state.edit ? <section className="edit-wrapper">
            <Input
              value={this.state.name}
              onChange={this.inputName}
            />
            <a onClick={this.onSubmit}>
              <img src={`${configs.imgPre}save.png`}/>
            </a>
            <a onClick={()=>{
              this.setState({
                edit:false
              });
            }}>
              <img src={`${configs.imgPre}close.png`}/>
            </a>
          </section> :
          <h2>
            <div>{current && current.name}</div>
            <small>
              <a onClick={()=>{
                this.setState({
                  edit:true
                });
              }}><i className="fa icon-edit"/></a>
            </small>
          </h2>
        }
        <a onClick={()=>{
          onShowAccount && onShowAccount();
        }}>{locale.detail}</a>
        <div>
          {Utils.formatAddress(current && current.address)}
          <a onClick={this.onCopy}><i className="fa icon-copy"/></a>
        </div>
      </div>
    )
  }
}
