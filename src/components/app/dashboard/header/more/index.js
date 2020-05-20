/**
 * Created by sean@ihuanqu.com on 2019/3/18.
 */
import "./style.less";
import React,{PureComponent} from 'react';
import extensionizer from 'extensionizer';
import popup from "../../../../../popup";

export default class More extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {locale,moreClass,onShowAccount,onRemove} = this.props;
    const {app:{network},account:{current}} = this.props.state;

    return (
      <ul className={moreClass}>
        <li>
          <a onClick={()=>{
            onShowAccount && onShowAccount();
          }}>
            <i className="fa icon-detail"/>
            {locale.account_info}
          </a>
        </li>
        {
          network.explorer ?
            <li>
              <a onClick={()=>{
                const url = `${network.explorer}/address/${current}?locale=${locale.key}`;
                if(extensionizer.storage){
                  popup.messageToBackground("redirect",{url:url});
                }
                else{
                  window.open(url);
                }
              }}>
                <i className="fa icon-copy-o"/>
                {locale.view_from_youchain}
              </a>
            </li> : null
        }
        <li>
          <a onClick={()=>{
            onRemove && onRemove();
          }}>
            <i className="fa icon-delete"/>
            {locale.account_remove}
          </a>
        </li>
      </ul>
    )
  }
}
