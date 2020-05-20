/**
 * Created by sean@ihuanqu.com on 2019/3/18.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import copy from "copy-to-clipboard";
import QRCode from "qrcode.react";
import extensionizer from 'extensionizer';
import Utils from "../../../../common/utils";
import popup from "../../../../popup";
import {Button} from "../../../../components/vendors";

export default class Account extends PureComponent{
  constructor(props){
    super(props);

    this.onCopy = this.onCopy.bind(this);
  }

  onCopy(value){
    const {locale} = this.props;
    copy(value);

    this.props.onShowMsg(locale.copy_success,"success");
  }

  render(){
    const {network,data,locale,onDismiss,onShowPrivateKey} = this.props;

    return (
      <div className="account-modal-wrapper">
        <div className="mask"/>
        <div className="dialog">
          <div className="body">
            <a className="close" onClick={()=>{
              onDismiss && onDismiss();
            }}>
              <i className="fa icon-close"/>
            </a>
            <div className="content">
              <section>
                <h2>{data.name}</h2>
              </section>
              <section>
                <QRCode value={data.address} size={140}/>
              </section>
              <section onClick={()=>{
                this.onCopy(data.address);
              }}>
                {Utils.formatAddress(data.address,false)}
              </section>
              <section>
                {
                  network.explorer ?
                    <Button
                      type={"default"}
                      text={locale.view_from_youchain}
                      block={true}
                      onClick={()=>{
                        const url = `${network.explorer}/address/${data.address}?locale=${locale.key}`;
                        if(extensionizer.storage){
                          popup.messageToBackground("redirect",{url:url});
                        }
                        else{
                          window.open(url);
                        }
                      }}
                    /> : null
                }

                <Button
                  type="default"
                  text={locale.account_export}
                  block={true}
                  onClick={()=>{
                    onShowPrivateKey && onShowPrivateKey();
                  }}
                />
              </section>
            </div>
          </div>
        </div>
      </div>
    )
  }
}