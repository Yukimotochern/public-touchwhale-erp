import axios, { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios'
import { ApiPromise } from './apiPromise'

let config: AxiosRequestConfig = {
  timeout: +process.env.REACT_APP_API_TIMEOUT,
  baseURL: process.env.REACT_APP_URL,
  headers: { 'content-type': 'application/json' },
}

class api1 {
  static Request() {
    return new ApiPromise((resolve, reject) => reject(1))
  }
  static url(url: string) {
    return `/api/v${process.env.REACT_APP_API_VERSION}${url}`
  }
  static checkToSend() {
    if (process.env.NODE_ENV === 'development') {
    }
  }
  static async request<DataType, BodyType = any>(
    url: string,
    method: Method,
    data: DataType,
    abortController: AbortController | undefined = undefined,
    cof: AxiosRequestConfig = {}
  ) {
    try {
      // make the actural request
      const res = await axios.request<
        DataType,
        AxiosRequestConfig<BodyType>,
        BodyType
      >({
        url: this.url(url),
        method,
        data,
        ...config,
        ...cof,
        signal: abortController?.signal || undefined,
      })
      console.log(res.data)
    } catch (err) {
      this.errorCatcher(err)
    }
  }
  static errorCatcher(err: any) {
    // mongoose Error
    // mongoDB Error
    // Axios Error
    // Network Error
    // customError
    // err instanceof axios.Cancel
    // Unknown Error
  }
  static async get(
    url: string,
    cof: AxiosRequestConfig = {},
    abortController: AbortController | undefined = undefined
  ) {
    return this.request<undefined>(url, 'GET', undefined, abortController, cof)
  }

  static async post<DataType, BodyType = any>(
    url: string,
    data: any,
    cof: AxiosRequestConfig = {},
    abortController: AbortController | undefined = undefined
  ) {
    return this.request<DataType, BodyType>(
      url,
      'POST',
      data,
      abortController,
      cof
    )
  }

  static async put<DataType, BodyType = any>(
    url: string,
    data: any,
    cof: AxiosRequestConfig = {},
    abortController: AbortController | undefined = undefined
  ) {
    return this.request<DataType, BodyType>(
      url,
      'PUT',
      data,
      abortController,
      cof
    )
  }

  static async delete<DataType, BodyType = any>(
    url: string,
    data: any,
    cof: AxiosRequestConfig = {},
    abortController: AbortController | undefined = undefined
  ) {
    return this.request<DataType, BodyType>(
      url,
      'DELETE',
      data,
      abortController,
      cof
    )
  }
}

// export default api
class api {
  static async get(url: string, cof: AxiosRequestConfig = {}) {
    return axios.get(this.apiUrl(url), { ...config, ...cof })
  }

  static async post(url: string, data: any, cof: AxiosRequestConfig = {}) {
    return axios.post(this.apiUrl(url), data, { ...config, ...cof })
  }

  static async put(url: string, data: any, cof: AxiosRequestConfig = {}) {
    return axios.put(this.apiUrl(url), data, { ...config, ...cof })
  }

  static async delete(
    url: string,
    data: any = {},
    headers: AxiosRequestHeaders = {}
  ) {
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

export { api1 }
export default api
