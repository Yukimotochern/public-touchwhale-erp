import { api } from 'api/dist/api'
import { message } from 'antd'
import { push } from 'redux-first-history'
import { store } from '../redux/store'
import { mainRouteLinks } from '../routes/appLink'
const mainLayoutRoutesFirstLevelPath = mainRouteLinks.map((route) => route.path)

const onUnAuthorizedRedirect = () => {
  const state = store.getState()
  if (state.auth.user) {
    // if user in present -> expired -> remind
    // if user is not present -> direct access -> no remind
    message.info('Please login in again for the security consideration.')
  }
  if (state.router.location) {
    const path = state.router.location.pathname
    // if in private route -> push to signIn
    if (mainLayoutRoutesFirstLevelPath.some((str) => path.startsWith(str))) {
      push('/signIn')
    }
  }
}

const onNetworkError = () => {
  message.error('Please check your net work connection.')
}
const onUnknownError = () => {
  message.error('Something went wrong. Try again latter.')
}

export function chain<t extends api<any, any>>(someApi: t) {
  someApi.onUnAuthoried = onUnAuthorizedRedirect
  someApi.onNetworkError = onNetworkError
  someApi.onUnknownError = onUnknownError
  return someApi
}
