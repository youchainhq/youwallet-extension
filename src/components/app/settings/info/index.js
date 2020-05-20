/**
 * Created by sean@ihuanqu.com on 2019/3/21.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import extensionizer from 'extensionizer';
import popup from "../../../../popup";
import configs from "../../../../common/configs";

export default class Info extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {locale} = this.props;

    return (
      <div className="settings-info-wrapper">
        <section>
          <img src={`${configs.imgPre}logo-o.png?t=20191111`} className="logo"/>
          <h4>YOUWallet<small>1.0.2</small></h4>
        </section>
        <section>
          <a
            onClick={()=>{
              const url = `https://static.iyouchain.com/extension/${locale.privacy_policy_filename}`;
              if(extensionizer.storage){
                popup.messageToBackground("redirect",{url:url});
              }
              else{
                window.open(url);
              }
            }}
          >{locale.privacy_policy}</a>
          <a
            onClick={()=>{
              const url = `https://static.iyouchain.com/extension/${locale.use_terms_filename}`;
              if(extensionizer.storage){
                popup.messageToBackground("redirect",{url:url});
              }
              else{
                window.open(url);
              }
            }}
          >{locale.use_terms}</a>
        </section>
      </div>
    )
  }
}