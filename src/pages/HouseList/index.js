import React from 'react'
import { Flex } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import styles from './index.module.css'

const { label } =JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
  render() {
    return (
      <div>
        <Flex className={styles.header}>
          <i className="iconfont icon-back" onClick={()=>this.props.history.go(-1)}/>
          <SearchHeader cityName={label} className={styles.searchHeader}/>
        </Flex>
      </div>
    )
  }
}