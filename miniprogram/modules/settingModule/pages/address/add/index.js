import Schema from 'async-validator'
import { reqAddAddress, reqAddressInfo, reqUpdateAddress } from '@/api/address'
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
  async saveAddrssForm() {
    // 组织参数 (完整地址、是否设置为默认地址)
    const { provinceName, cityName, districtName, address, isDefault } = this.data

    // 最终需要发送的请求参数
    const params = {
      ...this.data,
      fullAddress: provinceName + cityName + districtName + address,
      isDefault: isDefault ? 1 : 0
    }

    // 对组织以后的参数进行验证，验证通过以后，需要调用新增的接口实现新增收货地址功能
    const { valid } = await this.validatorAddress(params)

    // 如果 valid 等于 false，说明验证失败，就不执行后续的逻辑
    if (!valid) return

    // 如果 valid 等于 true，说明验证成功调用新增的接口实现新增收货地址功能
    const res = this.addressId ? await reqUpdateAddress(params) : await reqAddAddress(params)

    if (res.code === 200) {
      // 返回到收货地址列表页面
      wx.navigateBack({
        success: () => {
          // 需要给用户进行提示
          wx.toast({
            title: this.addressId ? '更新收货地址成功！' : '新增收货地址成功！'
          })
        }
      })
    }
  },

  validatorAddress(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

    // 验证手机号，是否符合中国大陆手机号码的格式
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'
    // 创建验证规则，验证规则是一个对象
    // 每一项是一个验证规则，验证规则属性需要和验证的数据进行同名
    const rules = {
      name: [
        { required: true, message: '请输入收货人姓名' },
        { pattern: nameRegExp, message: '收货人姓名不合法' }
      ],
      phone: [
        { required: true, message: '请输入收货人手机号' },
        { pattern: phoneReg, message: '手机号不合法' }
      ],
      provinceName: { required: true, message: '请选择收货人所在地区' },
      address: { required: true, message: '请输入详细地址' }
    }

    // 创建验证实例，并传入验证规则
    const validator = new Schema(rules)

    // 调用实例方法对数据进行验证
    // 注意：我们希望将验证结果通过 Promsie 的形式返回给函数的调用者
    return new Promise((resolve) => {
      validator.validate(params, (errors, fields) => {
        if (errors) {
          // 如果验证失败，需要给用户进行提示
          wx.toast({
            title: errors[0].message
          })

          resolve({ valid: false })
        } else {
          resolve({ valid: true })
        }
      })
    })
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
  },

  // 回显收货地址的逻辑
  async showAddressInfo(id) {
    // 判断是否存在 id，如果不存在 id，return 不执行后续的逻辑
    if (!id) return

    // 如果存在 id，将 id 挂载到 this 页面实例上
    this.addressId = id

    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: '更新收货地址'
    })

    // 调用方法获取收货地址详细信息
    const { data } = await reqAddressInfo(this.addressId)
    // 将获取的数据进行赋值
    this.setData(data)
  },

  onLoad(option) {
    this.showAddressInfo(option.id)
  }
})
