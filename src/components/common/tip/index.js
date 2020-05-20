/**
 * Created by sean@ihuanqu.com on 2019/3/15.
 */
import "./style.less";
import React,{PureComponent} from 'react';

export default class Tip extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {text} = this.props;

    return (
      <div className="tip-wrapper">
        {text}
      </div>
    )
  }
}