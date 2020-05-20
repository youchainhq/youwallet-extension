import "./style.less";
import React,{PureComponent} from 'react';
import configs from "../../../common/configs";

export default class Loading extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="loading">
        <div className="loading-mask"/>
        <div className="loading-body">
          <img src={`${configs.imgPre}loading.gif`} className="img"/>
        </div>
      </div>
    )
  }
}