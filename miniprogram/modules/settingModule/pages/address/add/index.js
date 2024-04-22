Page({
  // 页面的初始数据
  data: {
    name: '', // 收货人
    phone: '', // 手机号
    provinceName: '', // 省
    provinceCode: '', // 省 编码
    cityName: '', // 市
    cityCode: '', // 市 编码
    districtName: '', // 区
    districtCode: '', // 区 编码
    address: '', // 详细地址
    fullAddress: '', // 完整地址 (省 + 市 + 区 + 详细地址)
    isDefault: false // 设置默认地址，是否默认地址 → 0：否  1：是
  },

  // 保存收货地址
  // 获取表单元素的值
  saveAddrssForm(event) {
    // 解构出省市区以及 是否是默认地址
    const { provinceName, cityName, districtName, address, isDefault } = this.data

    // 拼接完整的地址
    const fullAddress = provinceName + cityName + districtName + address

    // 合并接口请求参数
    const params = {
      ...this.data,
      fullAddress,
      isDefault: isDefault ? 1 : 0
    }

    console.log(params)
  },

  // 省市区选择
  onAddressChange(event) {
    const [provinceName, cityName, districtName] = event.detail.value
    const [provinceCode, cityCode, districtCode] = event.detail.code
    this.setData({
      provinceName,
      cityName,
      districtName,
      provinceCode,
      cityCode,
      districtCode
    })
  }
})
