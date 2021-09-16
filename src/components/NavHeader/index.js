import React from "react"
import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types";

// import './index.scss'
import styles from './index.module.css'

// 方法一
// export default function NavHeader(props) {
//   return (
//     <NavBar
//       className="navbar"
//       mode="light"
//       icon={<i className="iconfont icon-back"/>}
//       onLeftClick={() => this.props.history.go(-1)}
//     >
//       {props.title}
//     </NavBar>
//   )
// }

// 方法二
function NavHeader({children, history, onLeftClick}) {

  // 默认点击行为
  const defaultHandler = () => history.go(-1)

  return (
    <NavBar
      className={styles.navBar}
      mode="light"
      icon={<i className="iconfont icon-back" />}
      // 在默认情况下只有 Route 组件直接渲染的组件才能获取到路由信息，使用history.go()，如果需要在其他组件中使用，可以使用高阶组件 withRouter 来获取 
      onLeftClick={onLeftClick || defaultHandler}
    >
      {children}
    </NavBar>
  )
}

// 添加props校验
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func
}

// withRouter(NavHeader) 函数的返回值也是一个组件
export default withRouter(NavHeader)