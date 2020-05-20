/**
 * Created by sean@ihuanqu.com on 2019/3/20.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import QRCode from "qrcode.react";
import extensionizer from 'extensionizer';
import popup from "../../../../popup";
import Utils from "../../../../common/utils";
import Button from "../../../vendors/button";

export default class YOU extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {locale} = this.props;
    const {account:{current},app:{network}} = this.props.state;

    return (
      <div className="deposit-wrapper">
        <div className="account-region">
          <section>
            <h4>{locale.deposit_name}</h4>
            <small>{locale.deposit_desc}</small>
          </section>
          <section>
            <QRCode value={current} size={140}/>
          </section>
          <section>
            {Utils.formatAddress(current,false)}
          </section>
        </div>
        {
          network.key === "main" ? <div className="obtain-region">
            <section>{locale.deposit_exchange}</section>
            <section>
              <a onClick={()=>{
                const url = "https://okex.me";
                if(extensionizer.storage){
                  popup.messageToBackground("redirect",{url:url});
                }
                else{
                  window.open(url);
                }
              }}>
              <span className="fa icon-okex">
                <span className="path1"/>
                <span className="path2"/>
                <span className="path3"/>
                <span className="path4"/>
                <span className="path5"/>
                <span className="path6"/>
                <span className="path7"/>
                <span className="path8"/>
                <span className="path9"/>
              </span>
              </a>
            </section>
          </div> : null
        }
        {
          network.key === "test" ? <div className="obtain-region">
            <section>{locale.deposit_faucet}</section>
            <section>
              <Button
                text={locale.deposit_faucet_button}
                block={true}
                onClick={()=>{
                  const url = `https://test-faucet.iyouchain.com?address=${current}&locale=${locale.key}`;
                  if(extensionizer.storage){
                    popup.messageToBackground("redirect",{url:url});
                  }
                  else{
                    window.open(url);
                  }
                }}
              />
            </section>
          </div> : null
        }
      </div>
    )
  }
}