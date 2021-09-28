import React from "react"
import { Route, Redirect } from "react-router"
import { isAuth } from '../../utils'


// 登录访问控制组件封装
const AuthRoute = ({component: Component, ...rest}) => {
  return <Route {...rest} render={props => {
    const isLogin = isAuth()
    if (isLogin) {
      // 将 props 传给组件，组件中才能获取到路由信息
      return <Component {...props} />
    } else {
      return <Redirect to={{
        pathname: '/login',
        state: {
          from: props.location
        }
      }}/>
    }
  }}>

  </Route>
}

export default AuthRoute