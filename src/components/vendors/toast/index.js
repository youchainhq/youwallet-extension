import './style.less';

import _ from 'lodash';
import React,{PureComponent} from 'react';
import ToastItem from './item';

export default class Toast extends PureComponent{
  constructor(props){
    super(props);

    this.idx = 1;

    this.state = {
      items:[]
    };

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.removeAll = this.removeAll.bind(this);
  }

  addItem(toast){
    let item = _.extend({},toast);

    if(this.state.items.length){
      return false;
    }

    item.id = this.idx;

    this.idx ++;

    this.setState({
      items: [...this.state.items,item]
    });
  }

  removeAll(){
    this.setState({
      items:[]
    });
  }

  removeItem(id){
    this.setState({
      items: [...this.state.items.filter((item)=>{
        return id !== item.id
      })]
    });
  }

  render(){
    return (
      _.isEmpty(this.state.items) ? null :
      <div className="toast">
        {
          this.state.items.map((item)=>{
            return <ToastItem key={`toast_${item.id}`} toast={item} id={item.id} clear={this.removeAll} remove={this.removeItem}/>
          })
        }
      </div>
    )
  }
}
