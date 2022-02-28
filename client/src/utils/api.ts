import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'

let config: AxiosRequestConfig = {
  timeout: +process.env.REACT_APP_API_TIMEOUT,
  baseURL: `${process.env.REACT_APP_URL}/api/v${process.env.REACT_APP_API_VERSION}/`,
  headers: { 'content-type': 'application/json' },
}

class api {
  static async get(url: string, cof: AxiosRequestConfig = {}) {
    return axios.get(url, { ...config, ...cof })
  }

  static async post(url: string, data: any, cof: AxiosRequestConfig = {}) {
    return axios.post(url, data, { ...cof, ...config })
  }

  static async put(url: string, data: any, cof: AxiosRequestConfig = {}) {
    return axios.put(url, data, { ...cof, ...config })
  }

  static async delete(url: string, data: any, headers: AxiosRequestHeaders) {
    return axios.delete(url, {
      ...config,
      data,
      headers: { 'content-type': 'application/json', ...headers },
    })
  }
}

export default api
