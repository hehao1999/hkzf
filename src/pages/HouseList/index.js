import React from 'react'
import { Flex } from 'antd-mobile'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'


import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
import styles from './index.module.css'

const { label, value } =JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
 
  state = {
    // 房屋数据
    list: [],
    // 总条数
    count: 0
  }

  // 初始化 filters
  filters = {}

  componentDidMount() {
    this.searchHouseList()
  }
  onFilter = (filters) => {
    this.filters = filters
    this.searchHouseList()
  }

  async searchHouseList() {
    const res = await API.get('/houses', {
      params: {
        cityId: value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    const {list, count} = res.data.body
    this.setState({
      list,
      count 
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
          cityId: value,
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



  render() {
    return (
      <div className={styles.root}>
         {/* 搜索导航栏 */}
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader cityName={label} className={styles.searchHeader}/>
        </Flex>
        
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />

        {/* 房屋列表 */}
        <div className={styles.houseItems}>

          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={this.state.count}
          >
            {({onRowsRendered, registerChild}) => (
              <WindowScroller>
                {({ height, isScrolling, scrollTop }) => (
                  <AutoSizer>
                    {({ width }) => (
                      <List
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        autoHeight  // 设置高度为 WindowScroller 最终去渲染的高度
                        width={width} // 视口宽
                        height={height} // 视口高
                        rowCount={this.state.count} // 行数
                        rowHeight={120}
                        rowRenderer={this.renderHouseList} // 渲染每一行
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>

          
        </div>
      </div>
    )
  }
}