/**
 * Created by sean@ihuanqu.com on 2019/3/18.
 */
import "./token.less";
import React,{PureComponent} from 'react';
import classnames from 'classnames';
import extensionizer from 'extensionizer';
import Storage from "../../../../../common/storage";
import Utils from "../../../../../common/utils";
import popup from "../../../../../popup";

export default class Token extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      action:false
    };

    this.onSwitch = this.onSwitch.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  onSwitch(){
    const {onDismiss} = this.props;
    this.props.actions.switchToken(this.props.data.tokenId);
    onDismiss && onDismiss();
  }

  onRemove(){
    this.props.actions.removeToken(this.props.data.tokenId);
  }

  render(){
    const {locale,data,usd,network,account} = this.props;

    const actionClass = classnames({
      "action-wrapper":true
    });

    const activeClass = classnames({
      active:data.address === Storage.currentToken.address
    });

    const balance = Utils.formatAccuracy(data.balance || 0,parseInt(data.decimal));

    return (
      <li className={activeClass}>
        <a className="menu-token-item" onClick={this.onSwitch}>
          <img src={data.icon}/>
          <div>
            <h1>
              {balance.toFixed(4)} {data.symbol}
              {
                data.base ? <small>{Utils.formatUsd(usd,balance)} USD</small> : null
              }
            </h1>
          </div>
          {
            data.base ? null :
              <span onClick={(e)=>{
                e.stopPropagation();
                e.preventDefault();
                this.setState({
                  action:!this.state.action
                });
              }}><i className="fa icon-more"/></span>
          }

          {
            this.state.action?
              <div className="mask" onClick={(e)=>{
                e.stopPropagation();
                e.preventDefault();
                this.setState({
                  action:false
                });
              }}/> : null
          }

          {
            this.state.action ? <ul className={actionClass}>
              <li>
                <div onClick={(e)=>{
                  e.stopPropagation();
                  e.preventDefault();
                  this.onRemove();
                }}>
                  {locale.token_hide}
                </div>
              </li>
                {
                  network.explorer ?
                    <li>
                      <div onClick={(e)=>{
                        e.stopPropagation();
                        e.preventDefault();

                        const url = `${network.explorer}/contract/${data.address}?locale=${locale.key}`;
                        if(extensionizer.storage){
                          popup.messageToBackground("redirect",{url:url});
                        }
                        else{
                          window.open(url);
                        }
                      }}>
                        {locale.view_from_youchain}
                      </div>
                    </li> : null
                }

            </ul> : null
          }
        </a>
      </li>
    )
  }
}