import React, { Component } from 'react'
import { SearchBar } from 'antd-mobile'
import { getCity } from '../../../utils/city'
import { API } from '../../../utils/api'
import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value
  // 定时器id
  timeId = null

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li
        key={item.community}
        className={styles.tip}
        onClick={() => this.onTipsClick(item)}
      >
        {item.communityName}
      </li>
    ))
  }

  handleSearchTxt = (value) => {
    this.setState({
      searchTxt: value
    })

    // 文本框值为空
    if (!value) {
      return this.setState({
        tipsList: []
      })
    }

    // 不为空，获取小区数据

    // 清除上一次的定时器
    clearTimeout(this.timeId)

    this.timeId = setTimeout( async () => {
      const res = await API.get('/area/community', {
        params: {
        name: value,
          id: this.cityId
        }
      })

      this.setState({
        tipsList: res.data.body
      })
    }, 500)
  }

  onTipsClick = item => {
    this.props.history.replace('add', {
      name: item.communityName,
      id: item.community
    })
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onChange={this.handleSearchTxt}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
