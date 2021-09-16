import React from "react"
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'

// 导入需要使用的组件
import CityList from "./pages/CityList"
import Home from "./pages/Home"
import Map from "./pages/Map"

function App() {
  return (
    <Router>
      <div className="App">
        {/* 路由配置 */}
        <Route path="/" exact render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
        <Route path="/map" component={Map} />
      </div>
    </Router>
  )
}

export default App
