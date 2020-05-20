/**
 * Created by sean@ihuanqu.com on 2019/3/14.
 */
import React, {PureComponent} from 'react';
import md5 from "md5";
import configs from "../../common/configs";
import Utils from "../../common/utils";

import {Button,Input,TextArea} from "../../components/vendors";
import _ from "lodash";

export default class Reset extends PureComponent {
  constructor(props) {
    super(props);

    if(props.params && props.params.from){
      this._from = "start";
    }

    this.state = {
      mnemonic:"",
      password:"",
      confirm:""
    };

    this.inputMnemonic = this.inputMnemonic.bind(this);
    this.inputPassword = this.inputPassword.bind(this);
    this.inputConfirm = this.inputConfirm.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validateConfirm = this.validateConfirm.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
  }

  formatMnemonic(){
    let mnemonic = this.state.mnemonic;

    return _.filter(mnemonic.split(" "),item=>{return !!item}).join(" ");
  }

  getDisabled() {
    const {password,confirm} = this.state;
    const mnemonic = this.formatMnemonic();

    if(mnemonic && password && password === confirm ){
      return false;
    }

    return true;
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

  inputConfirm(e){
    this.setState({
      confirm:e.target.value
    });
  }

  validatePassword(input = false) {
    if(input && !this.state.password){
      return {
        ret: false
      }
    }

    if (configs.regular.password.test(this.state.password)) {
      return {
        ret: true
      }
    }
    else {
      if(this.state.password){
        return {
          ret: false,
          msg: this.props.locale.password_new_error
        }
      }
      else{
        return {
          ret:false
        }
      }
    }
  }

  validateConfirm(input = false){
    if(input && !this.state.confirm){
      return {
        ret: false
      }
    }

    if (this.state.confirm === this.state.password) {
      return {
        ret: true
      }
    }
    else {
      if(this.state.confirm){
        return {
          ret: false,
          msg: this.props.locale.password_confirm_error
        }
      }
      else{
        return {
          ret:false
        }
      }
    }
  }


  onSubmit(){
    const mnemonic = this.formatMnemonic();

    if(!Utils.validateMnemonic(mnemonic)){
      this.props.onShowMsg(this.props.locale.mnemonic_error,"error");
      return;
    }

    let [vp, vc] = [
      this.validatePassword(true),
      this.validateConfirm(true)
    ];

    if(!vp.ret){
      this.refs.password.onBlur();
      return;
    }

    if(!vc.ret){
      this.refs.confirm.onBlur();
      return;
    }

    this.props.actions.createAccount({
      password:md5(this.state.password),
      mnemonic:mnemonic,
      name:"Account1"
    });
  }

  render() {
    const {locale,onRoute} = this.props;

    return (
      <section className="page-reset">
        <img src={`${configs.imgPre}logo.png?t=20191111002`} className="logo"/>
        <article>
          <h1>{locale.reset_title}</h1>
          <section>
            <TextArea
              ref="mnemonic"
              rows={3}
              placeholder={locale.reset_input_placeholder}
              title={locale.reset_input_title}
              value={this.state.mnemonic}
              onChange={this.inputMnemonic}
            />
          </section>
          <section>
            <Input
              ref="password"
              type="password"
              title={locale.password_new_title}
              value={this.state.password}
              onChange={this.inputPassword}
              onValidate={this.validatePassword}
            />
          </section>
          <section>
            <Input
              ref="confirm"
              type="password"
              title={locale.password_confirm_title}
              value={this.state.confirm}
              onChange={this.inputConfirm}
              onValidate={this.validateConfirm}
            />
          </section>
        </article>
        <div className="action-wrapper">
          <Button
            type={"default"}
            text={locale.back}
            block={true}
            onClick={()=>{
              if(this._from && this._from === "start"){
                onRoute("start");
              }
              else{
                onRoute("login");
              }
            }}
          />
          <Button
            text={locale.reset}
            block={true}
            disabled={this.getDisabled()}
            onClick={this.onSubmit}
          />
        </div>
      </section>
    );
  }
}