import React from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'

import SearchHeader from '../../components/SearchHeader'
import './index.scss'
import { getCurrentCity } from '../../utils'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent'
  },
]

// 获取地理位置信息
// 此处一坑，`navigator.geolocation`在chrome浏览器中处于安全设定，其只有https协议才能使用
// navigator.geolocation.getCurrentPosition(position => {
//   console.log('位置', position)
// })

export default class Index extends React.Component {
  // 轮播图状态数据
  state = {
    // 轮播图
    swipers: [],
    isSwiperLoaded: false,
    imgHeight: 212,

    // 租房小组
    groups: [],

    // 最新资讯
    news: [],

    // 当前城市名称
    curCityName: ''
  }

  // 获取轮播图数据方法
  async getSwipers() {
    const res = await API.get('/home/swiper')
    this.setState(() => {
      return {
        swipers: res.data.body,
        isSwiperLoaded: true
      }
    })
  }

  // 获取租房小组数据方法   
  async getGroups() {
    const res = await API.get('/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState({
      groups: res.data.body
    })
  }

  // 获取最新资讯
  async getNews() {
    const res = await API.get('/home/news', {
      params: {
         area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState({
      news: res.data.body
    })
  }

  // 获取当前城市
  async getCurCity() {
    const curCity = await getCurrentCity()
    this.setState({
      curCityName: curCity.label
    })
  }

  // 渲染轮播图
  renderSwipers() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="https://github.com/"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={BASE_URL + item.imgSrc}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  // 渲染导航菜单
  renderNavs() {
    return navs.map(item => <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
      <img src={item.img} alt="" />
      <h2>{item.title}</h2>
    </Flex.Item>)
  }

  // 渲染租房小组
  renderGroups(item) {
    return (
      <Flex className="group-item" justify="around" key={item.id}>
            <div className="desc">
              <p className="title">{item.title}</p>
              <span className="info">{item.desc}</span>
            </div>
            <img src={BASE_URL + item.imgSrc} alt="" />
          </Flex>
    )
  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img src={BASE_URL + item.imgSrc} alt="" />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  // DidMount
  componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()
    this.getCurCity()
  }

  render() {
    return (
      <div className="index">

        {/* 轮播图 */}
        <div className="swiper">
          {/* 此处一坑，异步更新的数据必须加判断条件，否则循环取数，轮播图失效 */}
          {this.state.isSwiperLoaded ? (
            <Carousel autoplay infinite>
              {this.renderSwipers()}
            </Carousel>) : ('')}
          
          {/* 搜索框 */}
          <SearchHeader cityName={this.state.curCityName} />
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">
          {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>
          <Grid
            data={this.state.groups}
            activeStyle={false}
            columnNum={2}
            square={false}
            hasLine={false}
          renderItem={item => this.renderGroups(item)}
          />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3>最新资讯</h3>
           <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
        
      </div>
    );
  }
}