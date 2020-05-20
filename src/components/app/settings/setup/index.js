/**
 * Created by sean@ihuanqu.com on 2019/3/21.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import md5 from "md5";
import Switch from "react-switch";
import copy from "copy-to-clipboard";
import configs from "../../../../common/configs";
import Storage from "../../../../common/storage";

import {Input,Button,Select} from "../../../../components/vendors";

export default class SetUp extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      mnemonicState:0,
      password:"",
    };

    this.onChangeLanguage = this.onChangeLanguage.bind(this);
    this.inputPassword = this.inputPassword.bind(this);
    this.onShow = this.onShow.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  onChangeLanguage(data){
    const {setLanguage} = this.props;

    setLanguage && setLanguage(data.key);
  }

  inputPassword(e){
    this.setState({
      password:e.target.value.trim()
    });
  }

  onShow(){
    if(Storage.password === md5(this.state.password)){
      this.setState({
        mnemonicState:2
      });
    }
    else{
      this.props.onShowMsg(this.props.locale.password_error,"error");
    }
  }

  onCopy(){
    copy(this.props.data.mnemonic);

    this.props.onShowMsg(this.props.locale.copy_success,"success");
  }

  onClear(){
    this.props.actions.clearTransaction();
  }

  render(){
    const {data,locale,defaultLanguage} = this.props;

    return (
      <div className="settings-setup-wrapper">
        <div className="form-wrapper">
          <div className="form-title">{locale.setting_language}</div>
          <Select
            options={configs.languages}
            defaultOption={defaultLanguage}
            onChange={this.onChangeLanguage}
          />
        </div>
        {
          data.mnemonic ?
            <div className="form-wrapper">
              <div className="form-title">{locale.mnemonic}</div>
              <section>
                {
                  this.state.mnemonicState === 0 ?
                    <a className="mnemonic-init" onClick={()=>{
                      this.setState({
                        mnemonicState:1
                      });
                    }}><i className="fa icon-lock"/>{locale.show}</a> : null
                }
                {
                  this.state.mnemonicState === 1 ?
                    <div className="mnemonic-password">
                      <Input
                        type="password"
                        placeholder={locale.password_placeholder}
                        value={this.state.password}
                        onChange={this.inputPassword}
                      />
                      <Button
                        text={locale.show}
                        type={"default"}
                        block={true}
                        onClick={this.onShow}
                      />
                    </div> : null
                }
                {
                  this.state.mnemonicState === 2 ?
                    <a className="mnemonic-show" onClick={this.onCopy}>
                      {
                        data.mnemonic.split(" ").map((item,key)=>{
                          return (
                            <span key={key}>{item}</span>
                          )
                        })
                      }
                    </a> : null
                }
                <div className="warning">{locale.mnemonic_warning}</div>
              </section>
            </div> : null
        }
        <div className="form-wrapper">
          <div className="form-title">{locale.transactions}</div>
          <Button
            text={locale.transactions_clear}
            type={"default"}
            block={true}
            onClick={this.onClear}
          />
        </div>
      </div>
    )
  }
}