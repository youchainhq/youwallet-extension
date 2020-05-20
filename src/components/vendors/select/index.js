import "./style.less";
import React,{PureComponent} from 'react';

import Dropdown from "../dropdown";

export default class Select extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      option:null
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount(){
    const {defaultOption} = this.props;

    this.setState({
      option:defaultOption || this.props.options[0]
    });
  }

  onChange(value){
    this.setState({
      option:value
    });

    this.props.onChange(value);
  }

  render(){
    const {options} = this.props;

    return (
      <div className="select-layout">
        <Dropdown ref="select">
          <a className="select-label">
            <div className="label">{this.state.option.label}</div>
            <div>
              {
                this.state.option.summary ?
                  <section>
                    <h4>{this.state.option.summary.title}</h4>
                    <small>{this.state.option.summary.desc}</small>
                  </section> : null
              }
              <i className="fa icon-select"/>
            </div>
          </a>
          <ul>
            {
              options.map((item,key)=>{
                return (
                  <li key={key} className="option">
                    <a onClick={()=>{
                      this.onChange(item);
                      this.refs.select.hide();
                    }}>
                      <span>{item.label}</span>
                      {
                        item.summary ?
                          <section>
                            <h4>{item.summary.title}</h4>
                            <small>{item.summary.desc}</small>
                          </section> : null
                      }
                    </a>
                  </li>
                )
              })
            }
          </ul>
        </Dropdown>
      </div>
    )
  }
}