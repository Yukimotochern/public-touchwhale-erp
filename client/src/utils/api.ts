import axios from 'axios'
let config = {
  timeout: +process.env.REACT_APP_API_TIMEOUT,
  baseURL: `${process.env.REACT_APP_URL}/api/${process.env.REACT_APP_API_VERSION}/`,
}
const axiosInstance = axios({
  timeout: +process.env.REACT_APP_API_TIMEOUT,
  baseURL: `${process.env.REACT_APP_URL}/api/${process.env.REACT_APP_API_VERSION}/`,
})
