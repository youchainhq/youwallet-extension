/**
 * Created by sean@ihuanqu.com on 2019/3/15.
 */
import "./style.less";
import React,{PureComponent} from 'react';

export default class Nav extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {title,onBack} = this.props;

    return (
      <div className="nav-wrapper">
        {
          onBack ? <a className="back" onClick={()=>{
            onBack && onBack();
          }}>
            <i className="fa icon-arrow-left"/>
          </a> : null
        }
        <div className="title">{title}</div>
      </div>
    )
  }
}