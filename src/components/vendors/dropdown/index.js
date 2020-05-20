/**
 * Created by sean@ihuanqu.com on 2018/9/4.
 */
import './style.less';

import React,{PureComponent} from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';

class Dropdown extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      active:false
    };

    this.onClick = this.onClick.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);

    this.onMouse = this.onMouse.bind(this);
  }

  componentDidMount(){
    document.addEventListener('click',this.onDocumentClick,false);
    document.addEventListener('touchend',this.onDocumentClick,false);
  }

  componentWillUnmount(){
    document.removeEventListener('click',this.onDocumentClick,false);
    document.removeEventListener('touchend',this.onDocumentClick,false);
  }

  onClick(e){
    if(this.props.mouseEvent){
      return;
    }

    e.preventDefault();
    this.setState({
      active:!this.state.active
    });
  }

  onMouse(e){
    if(!this.props.mouseEvent){
      return;
    }
    e.preventDefault();
    this.setState({
      active:!this.state.active
    });
  }

  onDocumentClick(e){
    if(!this.state.active){
      return;
    }
    const element = ReactDOM.findDOMNode(this);

    if(e.target !== element && !element.contains(e.target)){
      this.hide();
    }
  }

  hide(){
    this.setState({
      active:false
    });
  }

  show(){
    this.setState({
      active:true
    });
  }

  render(){
    const {children,inline,right} = this.props;

    const classNames = classnames({
      'dropdown-nice':true,
      'inline':!!inline,
      'right': !!right,
      'active':this.state.active,
      'b-inline':!!inline
    });

    return(
      <div className={classNames} onMouseEnter={this.onMouse} onMouseLeave={this.onMouse}>
        <div className="dropdown-target"
             onClick={this.onClick}
        >{children[0]}</div>
        <div className="dropdown-content">{children[1]}</div>
      </div>
    )
  }
}

export default Dropdown;