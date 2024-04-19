import { toast } from './utils/extendApi.js'
import './utils/extendApi'
import { asyncSetStorage } from './utils/storage'
App({
  async onShow() {
    asyncSetStorage('name', 'ssss').then((res) => {
      console.log(res)
    })
  }
})
