export interface ResponseBody<ResBodyDataType = any> {
  data?: ResBodyDataType | undefined
  message?: string
}

export interface ResponseBodyWithOutData extends Omit<ResponseBody, 'data'> {}
