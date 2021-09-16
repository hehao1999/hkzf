import React from 'react'
import ReactDOM from 'react-dom'
// import App from './App'

import 'antd-mobile/dist//antd-mobile.css'
import 'react-virtualized/styles.css'
import './assets/fonts/iconfont.css'

// 注意：将我们自己写的组件样式放在样式导入的最后面，从而避免被覆盖掉
import './index.css'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))