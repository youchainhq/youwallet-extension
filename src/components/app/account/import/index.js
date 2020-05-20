/**
 * Created by sean@ihuanqu.com on 2019/3/19.
 */
import "./style.less";
import _ from "lodash";
import React,{PureComponent} from 'react';
import md5 from "md5";
import configs from "../../../../common/configs";
import Utils from "../../../../common/utils";

import {Input,TextArea,Button,Select} from "../../../../components/vendors";

export default class Import extends PureComponent{
  constructor(props){
    super(props);

    const {locale} = props;

    this._options = [
      {
        key:configs.ACCOUNT_TYPE.PRIVATE_KEY,
        label:locale.privateKey
      },
      {
        key:configs.ACCOUNT_TYPE.MNEMONIC,
        label:locale.mnemonic,
      },
      {
        key:configs.ACCOUNT_TYPE.KEY_STORE,
        label:locale.jsonFile
      }
    ];

    this.state = {
      type:this._options[0],
      privateKey:"",
      mnemonic:"",
      file:"",
      password:"",
      keystore:null
    };

    this.getDisabled = this.getDisabled.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.inputPrivateKey = this.inputPrivateKey.bind(this);
    this.inputMnemonic = this.inputMnemonic.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.inputPassword = this.inputPassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getDisabled(){
    const {type,privateKey,file,password} = this.state;
    const mnemonic = this.formatMnemonic();

    switch (type.key){
      case configs.ACCOUNT_TYPE.PRIVATE_KEY:
        if(privateKey){
          return false;
        }
        break;
      case configs.ACCOUNT_TYPE.MNEMONIC:
        if(mnemonic && Utils.validateMnemonic(mnemonic)){
          return false;
        }
        break;
      case configs.ACCOUNT_TYPE.KEY_STORE:
        if(file && password){
          return false;
        }
        break;
    }

    return true;
  }

  onChangeType(option){
    this.setState({
      type:option
    });
  }

  inputPrivateKey(e){
    this.setState({
      privateKey: e.target.value.slice(0, 2) ===  "0x" ? e.target.value : `0x${e.target.value}`
    });
  }

  inputMnemonic(e){
    this.setState({
      mnemonic:e.target.value
    });
  }

  inputPassword(e){
    this.setState({
      password:e.target.value
    });
  }

  selectFile(e){
    this.setState({
      file:e.target.value
    });

    const reader = new FileReader();
    reader.readAsText(e.target.files[0],"UTF-8");
    reader.onload = (evt)=> {
      const keystore = evt.target.result;
      this.setState({
        keystore:JSON.parse(keystore)
      });
    };
  }

  formatMnemonic(){
    let mnemonic = this.state.mnemonic;

    return _.filter(mnemonic.split(" "),item=>{return !!item}).join(" ");
  }

  onSubmit(){
    const {locale,onShowMsg} = this.props;
    const {account} = this.props.state;
    const {type,privateKey,file,password,keystore} = this.state;
    const mnemonic = this.formatMnemonic();

    switch (type.key){
      case configs.ACCOUNT_TYPE.PRIVATE_KEY:
        if(privateKey){
          if(account && _.find(account.list,["privateKey",privateKey])){
            onShowMsg && onShowMsg(locale.account_import_warning,"error");
          }
          else{
            this.props.actions.importAccount({
              type:type.key,
              privateKey
            });
          }
        }
        break;
      case configs.ACCOUNT_TYPE.MNEMONIC:
        if(mnemonic && Utils.validateMnemonic(mnemonic)){
          if(account && _.find(account.list,["mnemonic",mnemonic])){
            onShowMsg && onShowMsg(locale.account_import_warning,"error");
          }
          else{
            this.props.actions.importAccount({
              type:type.key,
              mnemonic
            });
          }
        }
        break;
      case configs.ACCOUNT_TYPE.KEY_STORE:
        if(file && password){
          this.props.actions.importAccount({
            type:type.key,
            keystore:keystore,
            password:password
          });
        }
        break;
    }
  }

  render(){
    const {locale} = this.props;
    const {type} = this.state;

    return (
      <div className="content-common-wrapper account-import-wrapper">
        <section>
          <div className="form-wrapper">
            <div className="form-title">{locale.type_select}</div>
            <Select
              options={this._options}
              onChange={this.onChangeType}
            />
          </div>
          {
            type.key === configs.ACCOUNT_TYPE.PRIVATE_KEY ?
              <div className="body">
                <Input
                  title={locale.account_private_key}
                  value={this.state.privateKey}
                  onChange={this.inputPrivateKey}
                />
              </div> : null
          }

          {
            type.key === configs.ACCOUNT_TYPE.MNEMONIC ?
              <div className="body">
                <TextArea
                  ref="mnemonic"
                  rows={3}
                  placeholder={locale.account_mnemonic_placeholder}
                  title={locale.account_mnemonic_title}
                  value={this.state.mnemonic}
                  onChange={this.inputMnemonic}
                />
              </div> : null
          }

          {
            type.key === configs.ACCOUNT_TYPE.KEY_STORE ?
              <div className="body">
                <div className="form-wrapper">
                  <div className="form-title">{locale.file_select}</div>
                  <Input
                    type="file"
                    placeholder={locale.file_placeholder}
                    value={this.state.file}
                    // accept={".json"}
                    onChange={this.selectFile}
                  />
                </div>
                <div className="form-wrapper">
                  <div className="form-title">{locale.password}</div>
                  <Input
                    type="password"
                    placeholder={locale.password_placeholder}
                    value={this.state.password}
                    onChange={this.inputPassword}
                  />
                </div>
              </div> : null
          }
        </section>
        <section>
          <Button
            text={locale.import}
            disabled={this.getDisabled()}
            block={true}
            onClick={this.onSubmit}
          />
        </section>
      </div>
    )
  }
}