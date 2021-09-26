import React from "react"
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'

// 导入需要使用的组件
import CityList from "./pages/CityList"
import Home from "./pages/Home"
import Map from "./pages/Map"
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 路由配置 */}
        <Route path="/" exact render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
        <Route path="/map" component={Map} />

        {/* 登录、注册的路由规则： */}
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </div>
    </Router>
  )
}

export default App
