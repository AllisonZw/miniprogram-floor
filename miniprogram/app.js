import './utils/extendApi'
App({
  globalData: {
    address: {}
  },
  onShow() {
    // 获取当前小程序的账号信息
    const accountInfo = wx.getAccountInfoSync()
    // 通过小程序的账号信息，就能获取小程序版本
    console.log(accountInfo.miniProgram.envVersion)
  }
})
