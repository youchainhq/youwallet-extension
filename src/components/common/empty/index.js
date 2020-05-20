/**
 * Created by sean@ihuanqu.com on 2019/3/15.
 */
import "./style.less";
import React,{PureComponent} from 'react';

export default class Empty extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {children} = this.props;

    return (
      <div className="empty-wrapper">
        {children}
      </div>
    )
  }
}