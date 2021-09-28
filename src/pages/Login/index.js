import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'
import { API } from '../../utils/api'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {

  state = {
    username: '',
    password: ''
  }

  render() {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched } = this.props

    return (<div className={styles.root}>

      {/* 顶部导航 */}
      <NavHeader className={styles.navHeader}>账号登录</NavHeader>
      <WhiteSpace size="xl" />

      {/* 登录表单 */}
      <WingBlank>
        <form onSubmit={handleSubmit}>
          {/* 用户名 */}
          <div className={styles.formItem}>
            <input
              className={styles.input}
              value={values.username}
              name="username"
              placeholder="请输入账号"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {/* 长度为5到8位，只能出现数字、字母、下划线 */}
          {
            errors.username && touched.username && <div className={styles.error}>{errors.username}</div>
          }
  
          {/* 密码 */}
          <div className={styles.formItem}>
            <input
              className={styles.input}
              value={values.password}
              name="password"
              type="password"
              placeholder="请输入密码"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {/* 长度为5到12位，只能出现数字、字母、下划线 */}
          { errors.password && touched.password && <div className={styles.error}>{errors.password}</div> }

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


Login = withFormik({
  // 提供状态
  mapPropsToValues: () => ({ username: '', password: '' }),

  // 表单配置规则
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('必填')
      .matches(REG_UNAME, '长度为5-8位，只能出现数字、字母、下划线'),
    password: Yup.string()
      .required('必填')
      .matches(REG_PWD, '长度为5-12位，只能出现数字、字母、下划线')

  }),

  // 提交事件处理
  handleSubmit: async (values, { props }) => {
    const { username, password } = values

    const res = await API.post('/user/login', {
      username,
      password
    })

    const { status, body, description } = res.data
    if (status === 200) {
      // 登录成功
      localStorage.setItem('hkzf_token', body.token)
      if (!props.location.state) {
         props.history.go(-1)
      } else {
        // 这里不使用push的原因是使用push再go(-1)会返回到登录界面
        props.history.replace(props.location.state.from.pathname)
      }
     
    } else {
      // 登录失败
      Toast.info(description, 2, null, false)

    }
  },
  
})(Login)

// 返回高阶组件包装后的组件
export default Login