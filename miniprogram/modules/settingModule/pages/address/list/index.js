// pages/address/list/index.js
import { reqAddressList, reqDelAddress } from '../../../api/address'
import { swipeCellBehavior } from '@/behaviors/swipeCell'

const app = getApp()

Page({
  behaviors: [swipeCellBehavior],
  // 页面的初始数据
  data: {
    addressList: []
  },

  // 获取收货地址
  async getAddressList() {
    // 调用 API，获取收货地址
    const { data: addressList } = await reqAddressList()

    this.setData({
      addressList
    })
  },

  // 去编辑页面
  toEdit() {
    wx.navigateTo({
      url: '/modules/settingModule/pages/address/add/index'
    })
  },
  // 去编辑页面
  toEdit(event) {
    // 需要编辑的收货地址
    const { id } = event.target.dataset

    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },
  // 删除收货地址
  async delAddress(e) {
    const { id } = e.currentTarget.dataset
    console.log(e)
    await reqDelAddress(id)
    wx.toast({ title: '删除成功' })
    this.getAddressList()
  },
  changeAddress(event) {
    if (this.flag !== '1') return
    const addressId = event.currentTarget.dataset.id
    const selectAddress = this.data.addressList.find((item) => item.id === addressId)
    if (selectAddress) {
      app.globalData.address = selectAddress
      wx.navigateBack()
    }
  },
  onShow() {
    this.getAddressList()
  },
  onLoad(options) {
    this.flag = options.flag
  }
})
