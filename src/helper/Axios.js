import axios from "axios"
import AppConfig from "../config/AppConst"

export default () => {
  const instance = axios.create({
    baseURL: `${AppConfig.baseURL}`,
    timeout: 60000
  })

  return instance
}
