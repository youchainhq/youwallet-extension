/**
 * Created by sean@ihuanqu.com on 2019/3/14.
 */
import "./style.less";
import React,{PureComponent} from 'react';

export default class Steps extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    const {total,idx} = this.props;
    return (
      <div className="steps-wrapper">
        {
          [...Array(total)].map((item,key)=>{
            return <div key={key} className={idx === key ? "active" : ""}/>
          })
        }
      </div>
    )
  }
}
