import { reqCategoryData } from '../../api/category'
Page({
  data: {
    categoryList: [],
    activeIndex: 0
  },
  updateActive(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      activeIndex: index
    })
  },
  getCategoryData() {
    reqCategoryData().then((res) => {
      if (res.code == 200) {
        this.setData({
          categoryList: res.data
        })
      }
    })
  },
  onShow() {
    this.getCategoryData()
  }
})
