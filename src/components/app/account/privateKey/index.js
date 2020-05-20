/**
 * Created by sean@ihuanqu.com on 2019/3/18.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import md5 from "md5";
import copy from "copy-to-clipboard";
import Storage from "../../../../common/storage";
import Utils from "../../../../common/utils"

import {Button,Input} from "../../../../components/vendors";

export default class PrivateKey extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      password:"",
      key:""
    };

    this.inputPassword = this.inputPassword.bind(this);
    this.onShow = this.onShow.bind(this);
    this.onCopy = this.onCopy.bind(this);
  }

  inputPassword(e){
    this.setState({
      password:e.target.value.trim()
    });
  }

  onShow(){
    const {data} = this.props;

    if(Storage.password === md5(this.state.password)){
      this.setState({
        key:data.privateKey
      });
    }
    else{
      this.props.onShowMsg(this.props.locale.password_error,"error");
    }
  }

  onCopy(value){
    copy(value);

    this.props.onShowMsg(this.props.locale.copy_success,"success");
  }

  render(){
    const {data,locale,onDismiss,onBack} = this.props;

    return (
      <div className="private-key-modal-wrapper">
        <div className="mask"/>
        <div className="dialog">
          <div className="body">
            <a className="back" onClick={()=>{
              onBack && onBack();
            }}>
              <i className="fa icon-return"/>
            </a>
            <a className="close" onClick={()=>{
              onDismiss && onDismiss();
            }}>
              <i className="fa icon-close"/>
            </a>
            <div className="content">
              <section>
                <h2>{data.name}</h2>
                <div onClick={()=>{
                  this.onCopy(data.address);
                }}>
                  {Utils.formatAddress(data.address,false)}
                </div>
              </section>
              <section>
                <h1>{locale.account_private_key_show}</h1>
                <div>
                  {
                    this.state.key ?
                      <section className="private-key">
                        <div>{locale.account_private_key_copy}</div>
                        <div onClick={()=>{
                          this.onCopy(this.state.key);
                        }}>
                          {this.state.key}
                        </div>
                        <div className="warning">
                          {locale.account_private_key_warning}
                        </div>
                        <Button
                          text={locale.complete}
                          block={true}
                          onClick={()=>{
                            onDismiss && onDismiss();
                          }}
                        />
                      </section> :
                      <section className="password">
                        <Input
                          type="password"
                          title={locale.account_private_key_password}
                          placeholder={locale.account_private_key_password_placeholder}
                          value={this.state.password}
                          onChange={this.inputPassword}
                        />
                        <Button
                          text={locale.show}
                          type={"default"}
                          block={true}
                          onClick={this.onShow}
                        />
                        <div className="warning">
                          {locale.account_private_key_warning}
                        </div>
                      </section>
                  }
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    )
  }
}