/// <reference types="react-scripts" />
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_URL: string
      REACT_APP_API_TIMEOUT: string
      REACT_APP_API_VERSION: string
    }
  }
}

export {}
