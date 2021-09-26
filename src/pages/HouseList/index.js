/**
 * TODO：修改Item样式，防止溢出、完成房屋页面
 */
import React from 'react'
import { Flex, Toast } from 'antd-mobile'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'
import {getCurrentCity} from '../../utils'


import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
import Sticky from '../../components/Sticky'
import NoHouse from '../../components/NoHouse'
import styles from './index.module.css'

// const { label, value } =JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
 
  state = {
    // 房屋数据
    list: [],
    // 总条数
    count: 0,
    isLoading: false
  }

  // 初始化
  filters = {}
  label = ''
  value = ''

  async componentDidMount() {
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value
    this.searchHouseList()
  }

  onFilter = (filters) => {

    // 返回页面顶部
    window.scrollTo(0, 0)
    this.filters = filters
    this.searchHouseList()
  }

  async searchHouseList() {
    this.setState({
      isLoading: true
    })

    Toast.loading('加载中...', 0, null, false)
    const res = await API.get('/houses', {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    const { list, count } = res.data.body

    Toast.hide()

    if (count !== 0) {
      Toast.info(`共找到${count}套房源`, 2, null, false)
    }


    this.setState({
      list,
      count,
      isLoading: false
    })
  }
  renderHouseList = ({ key, index, style }) => {
    // 根据索引号获取当前行房屋数据
    const { list } = this.state
    const house = list[index]

    // 判断 house 是否存在
    // 如果不存在，就渲染 loading 元素占位
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading} />
        </div>
      )
    }

    return (
      <HouseItem
        key={key}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    )
  }

  // 判断每一行是否加载完成
  isRowLoaded = ({ index }) => {
  return !!this.state.list[index]
  }

  // 获取跟多列表数据
  // 返回值未 Promise 对象，且在数据加载完成时来调用 resolve 让 Promise 对象变为已完成
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(resolve => {
      API.get('/houses', {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })

        // 数据加载完成时，调用 resolve 即可
        resolve()
      })
    })
  }

  renderList() {
    const { count, isLoading } = this.state

    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                    width={width} // 视口的宽度
                    height={height} // 视口的高度
                    rowCount={count} // List列表项的行数
                    rowHeight={120} // 每一行的高度
                    rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )

  }


  render() {
    return (
      <div className={styles.root}>
         {/* 搜索导航栏 */}
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader cityName={this.label} className={styles.searchHeader}/>
        </Flex>
        
        {/* 条件筛选栏 */}
        <Sticky height={100}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          {this.renderList()}
        </div>
      </div>
    )
  }
}