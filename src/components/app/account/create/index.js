/**
 * Created by sean@ihuanqu.com on 2019/3/19.
 */
import "./style.less";
import _ from "lodash";
import React,{PureComponent} from 'react';
import copy from "copy-to-clipboard";
import Utils from "../../../../common/utils";
import Storage from "../../../../common/storage";

import {Input,Button} from "../../../../components/vendors"

export default class Create extends PureComponent{
  constructor(props){
    super(props);

    this._mnemonic = Utils.generateMnemonic();
    this._shuffle = [];

    this.state = {
      status:"name",
      name:"",
      checked:[]
    };

    this.inputName = this.inputName.bind(this);
    this.onCopy = this.onCopy.bind(this);
    // this.listenCopy = this.listenCopy.bind(this);
    // this.listenKeydown = this.listenKeydown.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount(){
    this.setState({
      name:`Account${_.keys(Storage.accounts).length + 1}`
    });
  }

  inputName(e){
    this.setState({
      name:e.target.value
    });
  }

  onCopy(){
    copy(this._mnemonic);

    this.props.onShowMsg(this.props.locale.copy_success,"success");
  }

  // listenCopy(e){
  //   e.clipboardData.setData('text/plain', this._mnemonic);
  //   this.props.onShowMsg(this.props.locale.copy_success,"success");
  //   e.preventDefault();
  //   return false;
  // }
  //
  // listenKeydown(e){
  //   if((e.ctrlKey || e.metaKey) && e.keyCode === 67){
  //     this.onCopy();
  //     e.preventDefault();
  //     return false;
  //   }
  // }

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

  onSubmit(){
    if(this.state.checked.join(" ") === this._mnemonic){
      this.props.actions.createAccount({
        mnemonic:this._mnemonic,
        name:this.state.name
      });
    }
    else{
      this.props.onShowMsg(this.props.locale.mnemonic_error,"error");
    }
  }

  render(){
    const {locale} = this.props;

    const data = this._mnemonic.split(" ");

    if(this.state.status === "name"){
      return (
        <div className="content-common-wrapper account-create-wrapper">
          <section>
            <Input
              placeholder={locale.account_name}
              value={this.state.name}
              onChange={this.inputName}
            />
          </section>
          <section>
            <Button
              text={locale.next}
              disabled={!this.state.name}
              block={true}
              onClick={()=>{
                this.setState({
                  status:"init"
                });
              }}
            />
          </section>
        </div>
      )
    }
    else if(this.state.status === "init"){
      return (
        <div className="content-common-wrapper account-create-wrapper">
          <section className="mnemonic-body">
            <div className="title">
              {locale.mnemonic_desc}
            </div>
            <div
              className="content"
              onClick={this.onCopy}
              // onCopy={this.listenCopy}
              // onKeyDown={this.listenKeydown}
            >
              {this._mnemonic}
              {/*{*/}
              {/*  data.map((item,key)=>{*/}
              {/*    return (*/}
              {/*      <span key={key}>{item}</span>*/}
              {/*    )*/}
              {/*  })*/}
              {/*}*/}
            </div>
          </section>
          <section className="action-wrapper">
            <Button
              text={locale.prev}
              type={"default"}
              block={true}
              onClick={()=>{
                this.setState({
                  status:"name"
                });
              }}
            />

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
          </section>
        </div>
      )
    }
    else if(this.state.status === "confirm"){
      return (
        <div className="content-common-wrapper account-create-wrapper">
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
          <section className="action-wrapper">
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
              text={locale.create}
              block={true}
              onClick={this.onSubmit}
            />
          </section>
        </div>
      )
    }
  }
}