import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.min.css'
import App from './App'
import { store, history } from './redux/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import { HistoryRouter as Router } from 'redux-first-history/rr6'
import './utils/i18n'
import { AppLoading } from './pages/loading/AppLoading'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <Suspense fallback={AppLoading}>
          <App />
        </Suspense>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
