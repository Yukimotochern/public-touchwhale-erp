import { api } from 'api/dist/api'
import { message } from 'antd'
import { push } from 'redux-first-history'
import { store } from '../redux/store'
import { mainRouteLinks } from '../routes/appLink'
import i18n from '../utils/i18n'

const mainLayoutRoutesFirstLevelPath = mainRouteLinks.map((route) => route.path)

const onUnAuthorizedRedirect = () => {
  const state = store.getState()
  if (state.auth.user) {
    // if user in present -> expired -> remind
    // if user is not present -> direct access -> no remind
    message.info(i18n.t('errors.login'))
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
  message.error(i18n.t('errors.network'))
}
const onUnknownError = () => {
  message.error(i18n.t('errors.unknown'))
}

export function chain<t extends api<any, any>>(someApi: t) {
  someApi.onUnAuthoried = onUnAuthorizedRedirect
  someApi.onNetworkError = onNetworkError
  someApi.onUnknownError = onUnknownError
  return someApi
}
