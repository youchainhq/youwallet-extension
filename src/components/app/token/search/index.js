/**
 * Created by sean@ihuanqu.com on 2019/3/19.
 */
import "./style.less";
import _ from "lodash";
import React,{PureComponent} from 'react';

import {Input,Button} from "../../../../components/vendors"

export default class Search extends PureComponent{
  constructor(props){
    super(props);

    this.state = {
      disabled:true,
      search:"",
      searchData:[],
      checkedData:[]
    };

    this.inputSearch = this.inputSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  inputSearch(e){
    this.setState({
      search:e.target.value,
      searchData:[
        {
          type:"ETH",
          name:"ETH(ERC20)"
        },
        {
          type:"USDT",
          name:"USDT(ERC20)"
        },
        {
          type:"YOU",
          name:"YOU"
        }
      ]
    });
  }

  onSelect(data){
    let checked = [...this.state.checkedData];

    let find = _.find(checked,(item)=>{
      return item.type === data.type;
    });

    if(find){
      _.remove(checked,(item)=>{
        return item.type === data.type;
      });
    }
    else{
      checked.push(data);
    }

    this.setState({
      checkedData:checked,
      disabled:!checked.length
    });
  }

  onSubmit(){
    this.props.onNext(this.state.checkedData);
  }

  render(){
    const {locale,onRoute} = this.props;
    const {searchData} = this.state;

    return (
      <div className="content-common-wrapper search-wrapper">
        <section>
          <Input
            icon={"search"}
            placeholder={locale.token_search}
            value={this.state.search}
            onChange={this.inputSearch}
          />
          {
            !_.isEmpty(searchData) ?
              <div className="result-wrapper">
                <section>{locale.search_result}</section>
                <section>
                  {
                    searchData.map((item,key)=>{
                      const active = _.find(this.state.checkedData,(i)=>{
                        return i.type === item.type;
                      });

                      return (
                        <a
                          key={key}
                          className={!!active ? "active" : ""}
                          onClick={()=>{
                            this.onSelect(item);
                          }}
                        >
                          <img src={`https://uchainstatic.oss-cn-hangzhou.aliyuncs.com/dapps/images/income/${item.type.toLocaleLowerCase()}.png`}/>
                          <span>
                            {item.name}
                          </span>
                        </a>
                      )
                    })
                  }
                </section>
              </div> : null
          }
        </section>
        <section>
          <Button
            text={locale.next}
            disabled={this.state.disabled}
            block={true}
            onClick={this.onSubmit}
          />
        </section>
      </div>
    )
  }
}