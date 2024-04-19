// 使用toast方法，可选参数，必须是对象参数

/**
 * @description 消息提示框
 * @param { Object } options 参数和 wx.showToast 参数保持一致
 */
const toast = ({ title = '数据加载中...', icon = 'none', duration = 2000, mask = true } = {}) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask
  })
}

/**
 * @description 模态对话框
 * @param { Object } options 参数和 wx.showModal 参数保持一致
 */
const modal = (options = {}) => {
  return new Promise((resolve) => {
    // 默认参数
    const defaultOpt = {
      title: '提示',
      content: '您确定执行该操作吗？',
      confirmColor: '#f3514f'
    }

    const opts = Object.assign({}, defaultOpt, options)

    wx.showModal({
      ...opts,
      complete({ confirm, cancel }) {
        confirm && resolve(true)
        cancel && resolve(false)
      }
    })
  })
}

wx.toast = toast
wx.modal = modal

export { toast, modal }
