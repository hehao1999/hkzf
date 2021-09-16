import React from 'react'
import { Route } from 'react-router'
import { TabBar } from 'antd-mobile';
import './index.css'
import Index from '../Index'
import HouseList from '../HouseList'
import Profile from '../Profile'
import News from '../News'
import { Redirect } from 'react-router-dom';


// TabBar 数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/infom'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  },
]

export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
    fullScreen: true,
  };

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
  // 渲染 TabBar.Item
  renderTabBarItem() {
    return tabItems.map(item => <TabBar.Item
      title={item.title}
      key={item.title}
      icon={<i className={`iconfont ${item.icon}`} />}
      selectedIcon={<i className={`iconfont ${item.icon}`} />}
      selected={this.state.selectedTab === item.path}
      // 图标高亮
      onPress={() => {
        this.setState({
          selectedTab: item.path,
        });
        // 路由切换
        this.props.history.push(item.path)
      }}

    />)
  }

  render() {
    return (
      <div className='home'>
          {/* 此处一坑，注意Route必须放在div里，否则生成的节点会覆盖在上面，链接和滑动效果失效 */}
          <Route exact path="/home" component={Index} />
          <Route path="/home/list" component={HouseList} />
          <Route path="/home/infom" component={News} />
          <Route path="/home/profile" component={Profile} />
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          {/* TabBar */}
          <TabBar
            tintColor="#21b97a"
            barTintColor="white"
            noRenderContent={true}
          >
            {/* 生成 TabBar */}
            {this.renderTabBarItem()}
          </TabBar>
      </div>

    )
  }

}