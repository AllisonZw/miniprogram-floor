import { reqGoodsInfo } from '../../../api/goods'
import { reqAddCart, reqCartList } from '@/api/cart'
import { userBehavior } from '../../../behaviors/userBehavior'
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    buyNow: 0, // 是否立即购买0加入购物车   1立即购买
    allCount: '' // 购物车商品总数量
  },

  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({ show: false })
  },

  async handlerSumbit() {
    // 解构获取数据
    const { token, count, blessing, buyNow } = this.data
    const goodsId = this.goodsId
    // 如果没有 token ，让用户新登录
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }

    // 加入购物车
    if (buyNow === 0) {
      // 加入购物车
      const res = await reqAddCart({ goodsId, count, blessing })
      if (res.code === 200) {
        wx.toast({
          title: '加入购物车成功'
        })
        // 购物车购买数量合计
        this.getCartCount()
        this.setData({
          show: false
        })
      }
    } else {
      // 立即购买
      wx.navigateTo({
        url: `/modules/orderPayModule/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing}`
      })
    }
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    this.setData({
      count: Number(event.detail)
    })
  },
  async getGoodsInfo() {
    const { data: goodsInfo } = await reqGoodsInfo(this.goodsId)
    this.setData({
      goodsInfo
    })
  },
  previewImage() {
    wx.previewImage({
      urls: this.data.goodsInfo.detailList
    })
  },
  // 计算购买数量
  async getCartCount() {
    // 如果没有 token ，说明用户是第一次访问小程序，没有进行登录过
    if (!this.data.token) return

    // 获取购物的商品
    const res = await reqCartList()

    if (res.data.length !== 0) {
      // 购物车商品累加
      let allCount = 0

      // 获取购物车商品数量
      res.data.forEach((item) => {
        allCount += item.count
      })

      // 将购物车购买数量赋值
      this.setData({
        // 展示的数据要求是字符串
        allCount: (allCount > 99 ? '99+' : allCount) + ''
      })
    }
  },
  onLoad(option) {
    // 挂在ID在this上面
    this.goodsId = option.goodsId
    this.getGoodsInfo()
    // 计算购买数量
    this.getCartCount()
  },

  // 转发功能，转发给好友、群聊
  onShareAppMessage() {
    return {
      title: '所有的怦然心动，都是你',
      path: '/pages/index/index',
      imageUrl: '../../../../../assets/images/love.jpg'
    }
  },

  // 能够把小程序分享到朋友圈
  onShareTimeline() {}
})
