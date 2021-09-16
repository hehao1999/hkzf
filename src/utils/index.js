import { API } from "./api"

// 获取最近地理位置
export const getCurrentCity = () => {
  let localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  if (!localCity) {
    // 本地存储中没有最近地理位置
    // 异步且在函数内嵌套函数，不能return，此处通过Promise暴露数据
    return new Promise((resolve, reject) => {
      try {
        const curCity = new window.BMapGL.LocalCity()
        curCity.get((async res => {
          const result = await API.get('/area/info', {
            params: {name: res.name}
          })
          localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
          resolve(result.data.body)
        }))
      } catch(e) {
        reject(e)
      }
    })
  }
  // 本地存储中有最近地理位置
  // 上边为了处理异步操作使用了Promise，为了函数返回值统一，此处也要使用Promise
  return Promise.resolve(localCity)
}