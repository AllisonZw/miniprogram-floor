import { reqGoodsList } from '@/api/goods'
Page({
  // 页面的初始数据
  data: {
    goodsList: [], // 商品列表数据
    total: 0, // 数据总条数
    isFinish: false, // 判断数据是否加载完毕
    isLoading: false, // 判断数据是否加载完毕

    // 接口请求参数
    requestData: {
      page: 1, // 页码
      limit: 10, // 每页请求多少条数据
      category1Id: '', // 一级分类 id
      category2Id: '' // 二级分类 id
    }
  },

  // 获取商品列表的数据
  async getGoodsList() {
    this.data.isLoading = true
    // 调用 API 获取数据
    const { data } = await reqGoodsList(this.data.requestData)
    this.data.isLoading = false
    // 将返回的数据赋值给 data 中的变量
    this.setData({
      goodsList: [...this.data.goodsList, ...data.records],
      total: data.total
    })
  },

  onReachBottom() {
    const { goodsList, total, requestData, isLoading } = this.data
    const { page } = requestData
    if (isLoading) return
    if (goodsList.length === total) {
      this.setData({
        isFinish: true
      })
      return
    }
    this.setData({
      requestData: {
        ...this.data.requestData,
        page: page + 1
      }
    })
    this.getGoodsList()
  },

  onPullDownRefresh() {
    this.setData({
      goodsList: [],
      total: 0,
      isFinish: false,
      requestData: {
        ...this.data.requestData,
        page: 1
      }
    })
    this.getGoodsList()
    wx.stopPullDownRefresh()
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    // 接收传递的参数
    Object.assign(this.data.requestData, options)
    // 获取商品列表的数据
    this.getGoodsList()
  }
})
