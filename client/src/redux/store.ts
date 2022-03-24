import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'
import { routeLinkSlice } from './mainLink.slice'
import { mainLayoutSlice } from '../layout/mainLayout/mainLayout.slice'
import { authSlice } from './auth/authSlice'
import thunk from 'redux-thunk'

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() })

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    routeLink: routeLinkSlice.reducer,
    layout: combineReducers({
      mainLayout: mainLayoutSlice.reducer,
    }),
    auth: authSlice.reducer,
  }),
  middleware: [thunk, routerMiddleware],
  devTools: true,
})

export const history = createReduxHistory(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
