/**
 * Created by sean@ihuanqu.com on 2019/3/14.
 */
import React, {PureComponent} from 'react';
import configs from "../../common/configs";

import {Button,Input} from "../../components/vendors";
import Steps from "../../components/common/steps";

export default class Password extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      password:"",
      confirm:""
    };

    this.getDisabled = this.getDisabled.bind(this);
    this.inputPassword = this.inputPassword.bind(this);
    this.inputConfirm = this.inputConfirm.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validateConfirm = this.validateConfirm.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
  }

  getDisabled() {
    const {password,confirm} = this.state;

    if(password && password === confirm ){
      return false;
    }

    return true;
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

    this.props.onRoute("mnemonic",{password:this.state.password});
  }

  render() {
    const {locale} = this.props;

    return (
      <section className="page-create">
        <img src={`${configs.imgPre}logo.png?t=20191111002`} className="logo"/>
        <article>
          <h1>{locale.password_title}</h1>
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
            text={locale.create}
            block={true}
            disabled={this.getDisabled()}
            onClick={this.onSubmit}
          />
        </div>
        <Steps total={3} idx={0}/>
      </section>
    );
  }
}