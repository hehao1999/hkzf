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

  // 标题菜单点击事件
  onTitleClick = type => {
    this.setState(prevState => {
      return {
        titleSelectedStatus: {
          ...prevState.titleSelectedStatus,
          [type]: true
        },
        openType: type
      }
    })
  }

  // 取消、隐藏对话框
  onCancel = () => {
    this.setState({
      openType: ''
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
      }
    })
    console.log(this.state.selectedValues)
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

          
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
