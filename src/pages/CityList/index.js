import React from 'react'
import './index.scss'
import { getCurrentCity } from '../../utils'
import { API } from '../../utils/api'
import { AutoSizer, List } from 'react-virtualized'
import { Toast } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'

const TITLE_HEIGHT = 36
const NAME_HEIGHT = 50
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

// 城市列表解析
const formatCityData = (list) => {
  const cityList = {}
  

  // 将所有城市加入到两个列表中，并按首字母排序
  list.forEach(item => {
    const first = item.short.substr(0, 1)
    if (cityList[first]) {
      cityList[first].push(item)
    } else {
      cityList[first] = [item]
    }
  })
  const cityIndex = Object.keys(cityList).sort()

  return {
    cityList,
    cityIndex
  }
}

// 处理字母索引
const formatCityIndex = (letter) => {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
}


export default class CityList extends React.Component {

  constructor(props) {
    super(props)

    // 状态数据
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0
    }

    // 创建ref对象实例
    this.cityListComponent = React.createRef()

  }


  // 获取城市列表
  async getCityList() {

    //获取全部城市数据
    const res = await API.get('/area/city?level=1')
    const {cityList, cityIndex} = formatCityData(res.data.body)

    // 获取热门城市数据
    const hotRes = await API.get('/area/hot')
    cityIndex.unshift('hot')
    cityList['hot'] = hotRes.data.body

    // 获取当前定位城市

    const curCity = await getCurrentCity()
    cityList['#'] = [curCity]
    cityIndex.unshift('#')
    this.setState({
      cityList,
      cityIndex
    })

  }

  // 动态计算行高
  getRowHeight = ({index}) => {
    // 索引标题高度 + 城市数量 * 城市名称高度
    const {cityIndex, cityList} = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }

  changeCity({ label, value }) {
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('没有找到房源信息', 1, null, false)
    }
  }

  // 渲染每一行，返回值为渲染内容
  rowRenderer = ({
                   key, // Unique key within array of rows
                   index, // Index of row within collection
                   isScrolling, // The List is currently being scrolled
                   isVisible, // This row is visible within the List (eg it is not an overscanned row)
                   style, // Style object to be applied to row (to position it)
                 }) => {
    // 获取每一行的字母索引
    const {cityIndex, cityList} = this.state
    const letter = cityIndex[index]

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {
          cityList[letter].map(item =>
            <div className="name" key={item.value} onClick={() => this.changeCity(item)}>
              {item.label}
            </div>)
        }
      </div>
    )
  }

  // 渲染右侧城市索引列表
  renderCityIndex = () => {
    /**
     * TODO: Chrome无法实现同步转化，FireFox可以
     */
    const {cityIndex, activeIndex} = this.state
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          this.cityListComponent.current.scrollToRow(index)
        }}
      >
        <span className={activeIndex === index ? "index-active" : ''}>
        {item === "hot" ? "热" : item.toUpperCase()}
      </span>
      </li>
    ))
  }

  // 获取List组件中渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }
  // hook: DidMount
  async componentDidMount() {
    await this.getCityList()

    // 调用 measureAllRows，提前计算出 List 中每一行的高度，实现 scrollToRow 精确跳转
    // 调用该方法需保证List组件中有数据
    try {
          this.cityListComponent.current.measureAllRows()
    } catch {
      Toast.info('哎呀，您慢点儿', 1, null, false)
    }
  }

  render() {
    return (
      <div className="citylist">
        {/* NavBar */}
        {/* 方法一 */}
        {/* <NavHeader title="城市找房"/> */}
        {/* 方法二 */}
        <NavHeader>城市选择</NavHeader>

        {/* 城市列表 */}
        <AutoSizer>
          {
            ({ width, height }) => (<List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
              
            )
          }
        </AutoSizer>
        {/* 索引列表 */}
        <ul className="city-index">
          {this.renderCityIndex()}
        </ul>
      </div>

    )
  }
}