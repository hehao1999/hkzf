import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'
import { API } from '../../utils/api'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {

  state = {
    username: '',
    password: ''
  }

  getUserName = e => {
    this.setState({
      username: e.target.value
    })
  }

  getPassword = e => {
    this.setState({
      password: e.target.value
    })
  }

  handelSubmit = async e => {
    e.preventDefault()
    const { username, password } = this.state
    const res = await API.post('/user/login', {
      username,
      password
    })
    const { status, body, description } = res.data
    if (status === 200) {
      // 登录成功
      localStorage.setItem('hkzf_token', body.token)
      this.props.history.go(-1)
    } else {
      // 登录失败
      Toast.info(description, 2, null, false)

    }
    console.log(res)
  }

  render() {
    const { username, password } = this.state
    
    return (<div className={styles.root}>

      {/* 顶部导航 */}
      <NavHeader className={styles.navHeader}>
        账号登录
      </NavHeader>

      <WhiteSpace size="xl" />

      {/* 登录表单 */}
      <WingBlank>
        <form onSubmit={this.handelSubmit}>
          {/* 用户名 */}
          <div className={styles.formItem}>
            <input
              className={styles.input}
              value={username}
              name="username"
              placeholder="请输入账号"
              onChange={this.getUserName}
            />
          </div>
          
          {/* 长度为5到8位，只能出现数字、字母、下划线 */}
          {/* <div className={styles.error}>账号为必填项</div> */}
          {/* 密码 */}
          <div className={styles.formItem}>
            <input
              className={styles.input}
              value={password}
              name="password"
              type="password"
              placeholder="请输入密码"
              onChange={this.getPassword}
            />
          </div>
          {/* 长度为5到12位，只能出现数字、字母、下划线 */}
          {/* <div className={styles.error}>账号为必填项</div> */}
          <div className={styles.formSubmit}>
            <button className={styles.submit} type="submit">
              登 录
            </button>
          </div>
        </form>
        <Flex className={styles.backHome}>
          <Flex.Item>
            <Link to="/register">
              还没有账号，去注册~
            </Link> </Flex.Item>
        </Flex>
      </WingBlank>
    </div>)
  }
}

export default Login
