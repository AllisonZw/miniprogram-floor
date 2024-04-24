// pages/address/list/index.js
import { reqAddressList, reqDelAddress } from '@/api/address'
import { swipeCellBehavior } from '@/behaviors/swipeCell'

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
  onShow() {
    this.getAddressList()
  }
})
