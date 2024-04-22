// pages/profile/profile.js
import { userBehavior } from './behavior'
import { getStorage, setStorage } from '../../../../utils/storage'
import { reqUploadFile, reqUpdateUserInfo } from '../../../../api/user'
import { toast } from '../../../../utils/extendApi'
Page({
  // 注册userBehavior
  behaviors: [userBehavior],

  // 页面的初始数据
  data: {
    isShowPopup: false // 控制更新用户昵称的弹框显示与否
  },

  getNickName(e) {
    // console.log(e.detail.value.nickname)
    this.setData({
      'userInfo.nickname': e.detail.value.nickname,
      isShowPopup: false
    })
  },

  chooseAvatar(e) {
    // wx.uploadFile({
    //   filePath: e.detail.avatarUrl,
    //   name: 'file',
    //   url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload',
    //   header: {
    //     token: getStorage('token')
    //   },
    //   success: (res) => {
    //     this.setData({
    //       'userInfo.headimgurl': JSON.parse(res.data)?.data
    //     })
    //   }
    // })
    reqUploadFile(e.detail.avatarUrl, 'file').then((res) => {
      this.setData({
        'userInfo.headimgurl': res.data
      })
    })
  },

  updateUserInfo() {
    reqUpdateUserInfo(this.data.userInfo).then((res) => {
      if (res.code == 200) {
        setStorage('userInfo', this.data.userInfo)
        this.setUserInfo(this.data.userInfo)
        toast({
          title: '用户信息更新成功'
        })
      }
    })
  },

  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      'userInfo.nickname': this.data.userInfo.nickname,
      isShowPopup: true
    })
  },

  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false
    })
  }
})
