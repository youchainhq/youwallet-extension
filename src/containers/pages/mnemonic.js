/**
 * Created by sean@ihuanqu.com on 2019/3/14.
 */
import _ from "lodash";
import React, {PureComponent} from 'react';
import md5 from "md5";
import copy from "copy-to-clipboard";
import configs from "../../common/configs";
import Utils from "../../common/utils";

import {Button} from "../../components/vendors";
import Steps from "../../components/common/steps";

export default class Mnemonic extends PureComponent {
  constructor(props) {
    super(props);

    if(props.params && props.params.password){
      this._password = props.params.password;
    }

    this._mnemonic = Utils.generateMnemonic();
    this._shuffle = [];

    this.state = {
      status:"init",
      checked:[]
    };

    this.onCopy = this.onCopy.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  onCopy(){
    copy(this._mnemonic);

    this.props.onShowMsg(this.props.locale.copy_success,"success");
  }

  onCheck(value){
    let checked = [...this.state.checked];

    if(_.indexOf(checked,value) === -1){
      checked.push(value);
    }
    else{
      _.remove(checked,(item)=>{
        return item === value;
      });
    }

    this.setState({
      checked
    });
  }

  onNext(){
    if(this.state.checked.join(" ") === this._mnemonic){
      this.props.actions.createAccount({
        password:md5(this._password),
        mnemonic:this._mnemonic,
        name:"Account1"
      });
    }
    else{
      this.props.onShowMsg(this.props.locale.mnemonic_error,"error");
    }
  }

  render() {
    const {locale} = this.props;
    const {status} = this.state;

    const data = this._mnemonic.split(" ");

    if(status === "init"){
      return (
        <section className="page-create">
          <img src={`${configs.imgPre}logo.png?t=20191111002`} className="logo"/>
          <article>
            <h1>{locale.mnemonic}</h1>
            <section className="mnemonic-body">
              <div className="title">
                {locale.mnemonic_desc}
              </div>
              <div
                className="content"
                onClick={this.onCopy}
              >
                {this._mnemonic}
              </div>
            </section>
          </article>
          <div className="action-wrapper">
            <Button
              text={locale.next}
              block={true}
              onClick={()=>{
                this.setState({
                  status:"confirm"
                });
                this._shuffle = _.shuffle(data);
              }}
            />
          </div>
          <Steps total={3} idx={1}/>
        </section>
      );
    }
    else if(status === "confirm"){
      return (
        <section className="page-create mnemonic-confirm">
          <img src={`${configs.imgPre}logo.png?t=20191111`} className="logo"/>
          <article>
            <h1>{locale.mnemonic_confirm_title}</h1>
            <section className="mnemonic-confirm-body">
              <div className="title">
                {locale.mnemonic_confirm_desc}
              </div>
              <div className="content">
                {
                  this._shuffle.map((item,key)=>{
                    return (
                      <a
                        key={key}
                        className={_.indexOf(this.state.checked,item) > -1 ? "active" : ""}
                        onClick={()=>{
                          this.onCheck(item);
                        }}
                      >{item}</a>
                    )
                  })
                }
              </div>
            </section>
            <section>
            </section>
          </article>
          <div className="action-wrapper">
            <Button
              text={locale.prev}
              type={"default"}
              block={true}
              onClick={()=>{
                this.setState({
                  status:"init",
                  checked:[]
                });
              }}
            />

            <Button
              text={locale.next}
              block={true}
              onClick={this.onNext}
            />
          </div>
          <Steps total={3} idx={2}/>
        </section>
      );
    }
  }
}