import axios from 'axios'

const ServerAddress = 'http://139.196.230.60:999/'

export default {
  login (userName, password) {
    return axios.get('api/Manage/login?userName=' + userName + '&password=' + password,{
        //baseURL: 'http://139.196.230.60:999/'
    })
  },
  postMaintain (model) {
    return axios.get(ServerAddress + "api/DeviceMaintain/AddMaintenanceRecord", model)
  }
}
