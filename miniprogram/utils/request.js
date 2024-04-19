class WxRequest {
  // 默认参数对象
  defaults = {
    baseURL: '', // 请求基准地址
    url: '', // 开发者服务器接口地址
    data: null, // 请求参数
    method: 'GET', // 默认请求方法
    // 请求头
    header: {
      'Content-type': 'application/json' // 设置数据的交互格式
    },
    timeout: 60000 // 小程序默认超时时间是 60000，一分钟
    // 其他参数...
  }

  // 定义拦截器对象，包含请求拦截器和响应拦截器方法，方便在请求或响应之前进行处理。
  interceptors = {
    // 请求拦截器
    request: (config) => config,
    // 响应拦截器
    response: (response) => response
  }

  // 定义 constructor 构造函数，用于创建和初始化类的属性和方法
  /**
   * @description 定义 constructor 构造函数，用于创建和初始化类的属性和方法
   * @param {*} params 用户传入的请求配置项
   */
  constructor(params = {}) {
    // 在实例化时传入的参数能够被 constructor 进行接收
    console.log(params)
    // 使用 Object.assign 合并默认参数以及传递的请求参数
    this.defaults = Object.assign({}, this.defaults, params)
  }

  /**
   * @description 发起请求的方法
   * @param { Object} options 请求配置选项，同 wx.request 请求配置选项
   * @returns Promise
   */
  request(options) {
    // 拼接完整的请求地址
    options.url = this.defaults.baseURL + options.url
    // 合并请求参数
    options = { ...this.defaults, ...options }
    // 在请求发送之前，调用请求拦截器，新增和修改请求参数
    options = this.interceptors.request(options)
    // 使用 Promise 封装异步请求
    return new Promise((resolve, reject) => {
      // 使用 wx.request 发起请求
      wx.request({
        ...options,

        // 接口调用成功的回调函数
        success: (res) => {
          // 响应成功以后触发响应拦截器
          if (this.interceptors.response) {
            // 调用响应拦截器方法，获取到响应拦截器内部返回数据
            // success: true 表示服务器成功响应了结果，我们需要对业务状态码进行判断
            res = this.interceptors.response({ response: res, isSuccess: true })
          }

          // 将数据通过 resolve 进行返回即可
          resolve(res)
        },

        // 当接口调用失败时会触发 fail 回调函数
        fail: (err) => {
          // 响应失败以后也要执行响应拦截器
          if (this.interceptors.response) {
            // isSuccess: false 表示是网络超时或其他问题
            err = this.interceptors.response({ response: err, isSuccess: true })
          }

          // 当请求失败以后，通过 reject 返回错误原因
          reject(err)
        }
      })
    })
  }

  // 封装 GET 实例方法
  get(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'GET' }, config))
  }

  // 封装 POST 实例方法
  post(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'POST' }, config))
  }

  // 封装 PUT 实例方法
  put(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'PUT' }, config))
  }

  // 封装 DELETE 实例方法
  delete(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'DELETE' }, config))
  }
}

// ----------------- 实例化 ----------------------

// 对 WxRequest 进行实例化
const instance = new WxRequest({
  baseURL: 'https://gmall-prod.atguigu.cn/mall-api'
})

// 设置请求拦截器
instance.setRequestInterceptor((config) => {
  console.log('执行请求拦截器')

  return config
})

// 设置响应拦截器
instance.setResponseInterceptor((response) => {
  const { response: res, isSuccess } = response

  // isSuccess: false 表示是网络超时或其他问题，提示 网络异常，同时将返回即可
  if (!isSuccess) {
    wx.toast('网络异常，请稍后重试~')
    // 如果请求错误，将错误的结果返回出去
    return res
  }

  // 简化数据
  return response.data
})

// 将 WxRequest 的实例通过模块化的方式暴露出去
export default instance
