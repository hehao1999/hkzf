import React, {lazy, Suspense} from "react"
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'

// 导入需要使用的组件
// import CityList from './pages/CityList'
import Home from './pages/Home'
// import Map from './pages/Map'
// import Login from './pages/Login'
// import HouseDetail from './pages/HouseDetail'
// import Register from './pages/Register'
// import Rent from './pages/Rent'
// import RentAdd from './pages/Rent/Add'
// import RentSearch from './pages/Rent/Search'
import AuthRoute from './components/AuthRoute'

// 动态方法导入组件
const CityList = lazy(() => import('./pages/CityList'))
const Map = lazy(() => import('./pages/Map'))
const Login = lazy(() => import('./pages/Login'))
const HouseDetail = lazy(() => import('./pages/HouseDetail'))
const Register = lazy(() => import('./pages/Register'))
const Rent = lazy(() => import('./pages/Rent'))
const RentAdd = lazy(() => import('./pages/Rent/Add'))
const RentSearch = lazy(() => import('./pages/Rent/Search'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="route-loading">loading...</div>}>
        <div className="App">
          {/* 路由配置 */}
          <Route path="/" exact render={() => <Redirect to="/home" />} />
          <Route path="/home" component={Home} />
          <Route path="/citylist" component={CityList} />
          <Route path="/map" component={Map} />

          {/* 房源详情的路由规则： */}
          <Route path="/detail/:id" component={HouseDetail} />
          {/* 登录、注册的路由规则： */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          {/* 房屋出租路由规则 */}
          <AuthRoute exact path='/rent' component={Rent} />
          <AuthRoute path='/rent/add' component={RentAdd} />
          <AuthRoute path='/rent/search' component={RentSearch} />
        </div>
      </Suspense>
    </Router>
  )
}

export default App
