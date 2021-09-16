import React from 'react'
import { Flex } from 'antd-mobile'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import './index.scss'

function SearchHeader({ history, cityName, className }) {
  return (
    <Flex className={["search-box", className || ''].join(' ')}>
      <Flex className="search">
        {/* 定位下拉框 */}
        <div className="location" onClick={() =>history.push('/citylist')}>
          <span className="name">{cityName}</span>
          <i className="iconfont icon-arrow"/>
        </div>
        {/* 搜索表单 */}
        <div className="form">
          <i className="iconfont icon-seach" />
          <span className="text">请输入小区或地址</span>
        </div>
      </Flex>
      <i className="iconfont icon-map" onClick={ () => history.push('/map')}/>
    </Flex>
  )
}

SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired,
  className: PropTypes.string
}
export default withRouter(SearchHeader)