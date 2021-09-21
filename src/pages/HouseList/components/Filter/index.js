import React, { Component } from "react"

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

  state = {
    // 选择、高亮
    titleSelectedStatus,
    // 控制显示隐藏子组件
    openType: '',
    // 用于筛选的条件
    filtersData: {},
    // 选中筛选值
    selectedValues
  }

  // componentDidMount
  componentDidMount() {
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

  // 根据是否默认值和选中状态返回 newTitleSelectedStatus
  isDefaultValue(selectedTitleType = null) {
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    console.log(titleSelectedStatus, selectedValues)
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
      if (key === 'more' ) {
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

    this.setState({
      openType: type,
      titleSelectedStatus: this.isDefaultValue()
    })
  }

  // 取消、隐藏对话框
  onCancel = () =>  {
    this.setState({
      openType: '',
      titleSelectedStatus: this.isDefaultValue()
    })
  }

  // 确定按钮
  onSave = (type, value) => {
    this.setState({
      // 显示隐藏筛选条件控件
      openType: '',
      selectedValues: {
        ...this.state.selectedValues,
        [type]: value
      },
        titleSelectedStatus: this.isDefaultValue(type)
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
      filtersData: { roomType, oriented, floor, characteristic }
    } = this.state;
    // 把数据封装到一个对象中，方便传递
    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }
    if (openType !== "more") {
      return null;
    }
    // 传递给子组件
    return <FilterMore data={data}/>;
  }

  render() {

    const { titleSelectedStatus, openType } = this.state
    
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {
          (openType === 'area' || openType === 'mode' || openType === 'price' || openType === 'more' )
            ? <div className={styles.mask} onClick={this.onCancel} />
            : null
        }

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
