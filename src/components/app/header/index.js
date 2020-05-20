/**
 * Created by sean@ihuanqu.com on 2019/3/5.
 */
import "./style.less";

import _ from "lodash";
import React,{PureComponent} from 'react';
import classnames from 'classnames';
import configs from "../../../common/configs";
import Storage from "../../../common/storage";

import {Dropdown} from "../../../components/vendors";
import My from "./my";

export default class Header extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      my:false
    };
  }

  render(){
    const {
      state,
      locale,
      actions,
      onRoute,
      onShowSettings,
      onShowCustom,
      onChangeNetwork
    } = this.props;

    const {app:{network,custom}} = this.props.state;

    const myClass = classnames({
      "my-wrapper":true,
      "animated":true,
      "fadeIn":this.state.my,
      "fadeOut":!this.state.my
    });

    const networkConfigs = _.keys(configs.networks);

    const currentIdx = _.findIndex(networkConfigs,(item)=>{
      return item === network.key;
    });

    return (
      <div className="header-wrapper">
        <img src={`${configs.imgPre}logo.png?t=20191111`} className="logo"/>
        <section>
          <div className="select-wrapper">
            <Dropdown ref="network">
              <a className="node-label">
                <div className={`node-status status-${currentIdx}`}/>
                <div className="node-name">
                  {network.key === "custom" && custom.name ? custom.name : locale.network[network.key]}
                </div>
                <i className="fa icon-arrow-down"/>
              </a>
              <ul>
                {
                  networkConfigs.map((key,idx)=>{
                    return (
                      <li key={key}>
                        <a className="network-item" onClick={()=>{
                          if(key === "custom"){
                            if(custom.provider){
                              onChangeNetwork && onChangeNetwork(configs.networks[key]);
                            }
                            onShowCustom && onShowCustom();
                          }
                          else{
                            onChangeNetwork && onChangeNetwork(configs.networks[key]);
                          }
                          this.refs.network.hide();
                        }}>
                          <div>
                            {
                              network.key === key ? <i className="fa icon-checked"/> : null
                            }
                          </div>
                          <div className={`node-status status-${idx % 10}`}/>
                          <div>{key === "custom" && custom.name ? custom.name : locale.network[key]}</div>
                        </a>
                      </li>
                    )
                  })
                }
              </ul>
            </Dropdown>
          </div>
          <a className="avatar" onClick={()=>{
            this.setState({
              my:!this.state.my
            });
          }}><i className="fa icon-avatar"/></a>

          {
            this.state.my ?
              <div className="mask" onClick={()=>{
                this.setState({
                  my:false
                });
              }}/> : null
          }

          {
            this.state.my ?
              <My
                state={state}
                locale={locale}
                actions={actions}
                onRoute={onRoute}
                myClass={myClass}
                onShowSettings={onShowSettings}
                onDismiss={()=>{
                  this.setState({
                    my:false
                  });
                }}
              />: null
          }
        </section>
      </div>
    )
  }
}
