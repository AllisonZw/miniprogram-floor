// pages/login/login.js
import { toast } from '../../utils/extendApi'
import { setStorage } from '../../utils/storage'
import { userStore } from '../../stores/userstore'
import { reqLogin, reqUserInfo } from '../../api/user'
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
ComponentWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token', 'userInfo'],
    actions: ['setToken', 'setUserInfo']
  },
  methods: {
    login() {
      wx.login({
        success: ({ code }) => {
          if (code) {
            // 获取code之后需要发送给开发服务器
            reqLogin(code).then((res) => {
              setStorage('token', res.data.token)

              this.setToken(res.data.token)
              // 获取用户信息
              this.getUserInfo()
              wx.navigateBack()
            })
          } else {
            toast({ title: '授权失败,请重新授权' })
          }
        }
      })
    },

    // 获取用户信息
    async getUserInfo() {
      // 调用接口，获取用户信息
      const { data } = await reqUserInfo()

      // 将用户信息存储到本地
      setStorage('userInfo', data)

      // 将用户信息存储到 Store 对象
      this.setUserInfo(data)
    }
  }
})
