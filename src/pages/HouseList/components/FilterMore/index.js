import React, { Component } from "react"
import styles from './index.module.css'
import FilterFooter from '../../../../components/FilterFooter'

export default class FilterMore extends Component {
  renderFilters() {
    return (
      <span className={[styles.tag, styles.tagActive].join(' ')}>东北</span>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.mask} />
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters()}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters()}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters()}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters()}</dd>
          </dl>
        </div>
        {/* 底部按钮 */}
        <FilterFooter className={styles.footer} />
      </div>
    )
  }
}