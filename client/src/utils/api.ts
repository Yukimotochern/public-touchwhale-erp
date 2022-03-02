import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'

let config: AxiosRequestConfig = {
  timeout: +process.env.REACT_APP_API_TIMEOUT,
  baseURL: process.env.REACT_APP_URL,
  headers: { 'content-type': 'application/json' },
}

class api {
  static async get(url: string, cof: AxiosRequestConfig = {}) {
    return axios.get(this.apiUrl(url), { ...config, ...cof })
  }

  static async post(url: string, data: any, cof: AxiosRequestConfig = {}) {
    return axios.post(this.apiUrl(url), data, { ...cof, ...config })
  }

  static async put(url: string, data: any, cof: AxiosRequestConfig = {}) {
    return axios.put(this.apiUrl(url), data, { ...cof, ...config })
  }

  static async delete(url: string, data: any, headers: AxiosRequestHeaders) {
    return axios.delete(this.apiUrl(url), {
      ...config,
      data,
      headers: { 'content-type': 'application/json', ...headers },
    })
  }
  static apiUrl(url: string) {
    return `/api/v${process.env.REACT_APP_API_VERSION}${url}`
  }
}

class apiWithErrorControl_NOT_COMPLETED {
  static async get(url: string, cof: AxiosRequestConfig = {}) {
    try {
      const { data } = await axios.get(url, { ...config, ...cof })
      return this.validateData(data)
    } catch (err) {
      this.catchError(err)
    }
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
  static catchError(err: any): never {
    throw Error('')
  }
  static validateData(data: any) {}
}

export { apiWithErrorControl_NOT_COMPLETED }

export default api
