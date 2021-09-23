import React from 'react'
import { Flex } from 'antd-mobile'
import { List } from 'react-virtualized'
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
  renderHouseList = ({ key, index, style, }) => {
    // 根据索引号获取当前行房屋数据
    const { list } = this.state
    const house = list[index]
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


  render() {
    return (
      <div>
        {/* 搜索导航栏 */}
        <Flex className={styles.header}>
          <i className="iconfont icon-back" onClick={()=>this.props.history.go(-1)}/>
          <SearchHeader cityName={label} className={styles.searchHeader}/>
        </Flex>
        
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          <List
            width={300}
            height={300}
            rowCount={this.state.count} // 行数
            rowHeight={120}
            rowRenderer={this.renderHouseList} // 渲染每一行
          />   
        </div>
      </div>
    )
  }
}