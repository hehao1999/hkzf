import React, { Component } from "react"
// import { Spring } from 'react-spring/renderprops'
import { Spring  } from 'react-spring'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import styles from './index.module.css'

import {API} from '../../../../utils/api'

// 选择、高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {

  constructor(props) {
    super()
    this.state = {
      // 选择、高亮
      titleSelectedStatus,
      // 控制显示隐藏子组件
      openType: '',
      // 用于筛选的条件
      filtersData: {},
      // 选中筛选值
      selectedValues
    }

    // 绑定this以便在子组件中使用并改变该组件的状态
    this.isDefaultValue = this.isDefaultValue.bind(this)
    this.onChangeState = this.onChangeState.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  // componentDidMount
  componentDidMount() {
    this.htmlBody = document.body
    this.getFiltersData()
  }

  // 获取筛选条件
  async getFiltersData() {
    const {value} = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)

    this.setState({
      filtersData: res.data.body
    })
  }

  // 多此一举的函数
  onChangeState(stateName) {
    this.setState(
      {titleSelectedStatus: stateName}
    )
  }

  // 根据是否默认值和选中状态返回 newTitleSelectedStatus
  isDefaultValue(selectedTitleType = null) {
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    Object.keys(titleSelectedStatus).forEach(key => {

      // 当前选中项
      if (selectedTitleType && key === selectedTitleType) {
        newTitleSelectedStatus[key] = true
        return 
      }
      // area
      const selectedVal = selectedValues[key]
      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        newTitleSelectedStatus[key] = true
        return 
      }
      // mode
      if (key === 'mode' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
        return 
      }
      // price
      if (key === 'price' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
        return 
      }
      // more
      if (key === 'more' && selectedValues.more.length !== 0 ) {
        newTitleSelectedStatus[key] = true  
        return
      }
      // else
      newTitleSelectedStatus[key] = false
      return 
    })

    return newTitleSelectedStatus
  }

  // 标题菜单点击事件
  onTitleClick = type => {
    // 给 body 添加样式
    this.htmlBody.className = 'body-fixed'

    this.setState({
      openType: type,
      titleSelectedStatus: this.isDefaultValue(type)
    })
  }

  // 取消、隐藏对话框
  onCancel() {
    this.htmlBody.className = ''
    this.setState({
      openType: '',
      titleSelectedStatus: this.isDefaultValue()
    })
  }

  // 确定按钮
  onSave = (type, value) => {
    this.htmlBody.className = ''
    
    let newSelectedValues = {
      ...this.state.selectedValues,
      [type]: value
    }

    const { area, mode, price, more } = newSelectedValues
    const filters = {}
    const areaKey = area[0]
    let areaValue = "null"
    if (area.length === 3) {
      areaValue = area[2] !== "null" ? area[2] : area[1]
    }
    filters[areaKey] = areaValue;
    // 方式和租金
    filters.mode = mode[0];
    filters.price = price[0];
    // more
    filters.more = more.join(",");

    this.props.onFilter(filters)

    this.setState({
      // 显示隐藏筛选条件控件
      openType: '',
      selectedValues: newSelectedValues   
    }, () => {
      this.setState({
        titleSelectedStatus: this.isDefaultValue()
      })
    })
  }

  // 渲染 FilterPicker 组件
  renderFilterPicker() {
    // 解构所需参数
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state;
    
    // 传递参数
    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]

    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }

    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }

    return <FilterPicker
      // 这里添加 key 可以解决未关闭 FilterPicker 对话框不同质筛选条件
      //切换均变为默认值问题， 因为添加了不同 key 值React会重新渲染
      key={openType}
      onCancel={this.onCancel}
      onSave={this.onSave}
      data={data}
      cols={cols}
      type={openType}
      defaultValue={defaultValue}
    />
  }

  // 渲染 FilterMore 组件
  renderFilterMore() {
    // 获取对应数据 roomType，oriented，floor，characteristic
    const {
      openType,
      selectedValues,
      filtersData: { roomType, oriented, floor, characteristic }
    } = this.state;

    // 把数据封装到一个对象中，方便传递
    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }

    const defaultValue = selectedValues.more

    if (openType !== "more") {
      return null;
    }
    // 传递给子组件
    return (
      <FilterMore
        data={data}
        type={openType}
        onSave={this.onSave}
        onCancel={this.onCancel}
        defaultValue={defaultValue}
        isDefaultValue={this.isDefaultValue}
        onChangeState={this.onChangeState}
      />
    )
  }

  renderMask() {
    const { openType } = this.state
    const isHide = openType ==='more' || openType === ''

    if (openType === 'more' || openType === '') {
      return null
    }
    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHide ? 0 : 10 }}>
        {props => {
          if (props.opacity === 0) {
            return null
          }

          return (
            <div
              style={props}
              className={styles.mask}
              onClick={this.onCancel}
            />
          )
        }}
      </Spring>
    )
  }

  render() {

    const { titleSelectedStatus} = this.state
    
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {this.renderFilterPicker()}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
