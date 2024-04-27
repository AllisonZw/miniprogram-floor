import { userStore } from '@/stores/userstore'
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { reqCartList, reqUpdateChecked, reqCheckAllStatus, reqAddCart, reqDelCartGoods } from '@/api/cart'
// 从 miniprogram-licia 导入防抖函数
import { debounce } from 'miniprogram-licia'
// 导入让删除滑块自动弹回的 behavior
import { swipeCellBehavior } from '@/behaviors/swipeCell'
const computedBehavior = require('miniprogram-computed').behavior

// pages/cart/component/cart.js
ComponentWithStore({
  // 注册behaviors
  behaviors: [computedBehavior, swipeCellBehavior],

  // 让页面与Store对象建立关联
  storeBindings: {
    store: userStore,
    fields: ['token']
  },

  // 定义计算属性
  computed: {
    // 是否全选
    selectAllStatus(data) {
      // 不能使用this来访问data中的数据
      return data.cartList.length !== 0 && data.cartList.every((item) => item.isChecked === 1)
    },
    // 计算商品价格总和
    totalPrice(data) {
      let totalPrice = 0

      data.cartList.forEach((item) => {
        // 如果商品的 isChecked 属性等于，说明该商品被选中的
        if (item.isChecked === 1) {
          totalPrice += item.count * item.price
        }
      })

      return totalPrice
    }
  },

  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },

  // 组件的方法列表
  methods: {
    toOrder() {
      if (this.data.totalPrice === 0) {
        wx.toast({
          title: '请选择需要购买的商品'
        })
        return
      }
      // 跳转到订单的结算页面
      wx.navigateTo({
        url: '/modules/orderPayModule/pages/order/detail/detail'
      })
    },
    // 修改数量
    changeBuyNum: debounce(async function (event) {
      // 获取最新的购买数量，
      // 如果用户输入的值大于 200，购买数量需要重置为 200
      // 如果不大于 200，直接返回用户输入的值
      let newBuyNum = event.detail > 200 ? 200 : event.detail
      // 获取商品的 ID 和 索引
      const { id: goodsId, index, oldbuynum } = event.target.dataset
      // 验证用户输入的值，是否是 1 ~ 200 直接的正整数
      const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
      // 对用户输入的值进行验证
      const regRes = reg.test(newBuyNum)
      // 如果验证没有通过，需要重置为之前的购买数量
      if (!regRes) {
        this.setData({
          [`cartList[${index}].count`]: oldbuynum
        })
        return
      }
      const disCount = newBuyNum - oldbuynum
      if (disCount === 0) return
      const res = await reqAddCart({ goodsId, count: disCount })

      // 服务器更新购买数量成功以后，更新本地的数据
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].count`]: newBuyNum,
          [`cartList[${index}].isChecked`]: 1
        })
      }
    }, 500),

    // 实现全选
    async changeAllStatus(e) {
      const { detail } = e
      const isChecked = detail ? 1 : 0
      const res = await reqCheckAllStatus(isChecked)
      if (res.code === 200) {
        // this.showTipList()
        const newCartList = JSON.parse(JSON.stringify(this.data.cartList))
        newCartList.forEach((item) => (item.isChecked = isChecked))
        this.setData({
          cartList: newCartList
        })
      }
    },

    // 切换商品的选中状态
    async updateChecked(event) {
      // 获取最新的选中状态
      const { detail } = event
      // 获取商品的索引和 id
      const { id, index } = event.target.dataset
      // 将最新的状态格式化成后端所需要的数据格式
      const isChecked = detail ? 1 : 0

      // 调用接口，传入参数，更新商品的状态
      const res = await reqUpdateChecked(id, isChecked)

      // 如果数据更新成功，需要将本地的数据一同改变
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked
        })
      }
    },

    // 处理页面的展示
    async showTipList() {
      // 将 token 进行解构
      const { token } = this.data
      if (!token) {
        this.setData({
          emptyDes: '您尚未登录，点击登录获取更多权益',
          cartList: []
        })

        return
      }
      // 获取商品列表数据
      const { data: cartList, code } = await reqCartList()
      if (code === 200) {
        // 2. 如果用户登录，购物车列表为空，展示文案： 还没有添加商品，快去添加吧～
        this.setData({
          cartList,
          emptyDes: cartList === 0 && '还没有添加商品，快去添加吧～'
        })
      }
    },

    // 删除购物车中的商品
    async delCartGoods(event) {
      // 获取需要删除商品的 id
      const { id } = event.currentTarget.dataset

      // 询问用户是否删除该商品
      const modalRes = await wx.modal({
        content: '您确认删除该商品吗 ?'
      })

      if (modalRes) {
        await reqDelCartGoods(id)

        this.showTipList()
      }
    },

    onHide() {
      // 在页面隐藏的时候，需要让删除滑块自动弹回
      this.onSwipeCellCommonClick()
    },

    onShow() {
      this.showTipList()
    }
  }
})
