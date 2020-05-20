/**
 * Created by sean@ihuanqu.com on 2019/3/19.
 */
import React, {PureComponent} from 'react';

import Nav from "../../components/common/nav";
import Tab from "../../components/common/tab";
import Tip from "../../components/common/tip";

import Search from "../../components/app/token/search";
import SearchResult from "../../components/app/token/search/result";
import Custom from "../../components/app/token/custom";

export default class Token extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // idx:0,
      // searchResult:[]
    };

    this.onBack = this.onBack.bind(this);
    // this.onChangeTab = this.onChangeTab.bind(this);
    // this.setSearchResult = this.setSearchResult.bind(this);
  }

  onBack(){
    const {onRoute} = this.props;
    onRoute("dashboard");
    // const {idx,searchResult} = this.state;
    //
    // if(idx === 0){
    //   if(_.isEmpty(searchResult)){
    //     onRoute("dashboard");
    //   }
    //   else{
    //     this.setState({
    //       searchResult:[]
    //     });
    //   }
    // }
    // else if(idx === 1){
    //   onRoute("dashboard");
    // }
  }

  // onChangeTab(idx){
  //   this.setState({
  //     idx
  //   });
  // }
  //
  // setSearchResult(data){
  //   this.setState({
  //     searchResult:data
  //   });
  // }

  render() {
    const {locale,onRoute,actions,onShowMsg} = this.props;
    // const {idx,searchResult} = this.state;

    const tabs = [
      // {
      //   title:locale.search
      // },
      {
        title:locale.token_custom
      }
    ];

    return (
      <section className="page-token">
        <Nav
          title={locale.token_add}
          onBack={this.onBack}
        />
        <Tab
          data={tabs}
          // onChange={this.onChangeTab}
        />
        <Custom
          locale={locale}
          onRoute={onRoute}
          actions={actions}
          onShowMsg={onShowMsg}
        />
        {/*{*/}
          {/*idx === 0 && _.isEmpty(searchResult) ?*/}
            {/*<Tab*/}
              {/*data={tabs}*/}
              {/*onChange={this.onChangeTab}*/}
            {/*/> :*/}
            {/*<Tip*/}
              {/*text={locale.token_confirm}*/}
            {/*/>*/}
        {/*}*/}

        {/*{*/}
          {/*idx === 0 && _.isEmpty(searchResult) ?*/}
            {/*<Search*/}
              {/*locale={locale}*/}
              {/*onRoute={onRoute}*/}
              {/*onNext={this.setSearchResult}*/}
            {/*/> : null*/}
        {/*}*/}

        {/*{*/}
          {/*idx === 0 && !_.isEmpty(searchResult) ?*/}
            {/*<SearchResult*/}
              {/*locale={locale}*/}
              {/*onRoute={onRoute}*/}
              {/*data={searchResult}*/}
            {/*/> : null*/}
        {/*}*/}

        {/*{*/}
          {/*idx === 1 ?*/}
            {/*<Custom*/}
              {/*locale={locale}*/}
              {/*onRoute={onRoute}*/}
            {/*/> : null*/}
        {/*}*/}
      </section>
    );
  }
}