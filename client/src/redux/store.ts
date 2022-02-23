import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'
import { routeLinkSlice } from '../layout/routeLink.slice'
import { mainLayoutSlice } from '../layout/mainLayout/mainLayout.slice'

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() })

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    routeLink: routeLinkSlice.reducer,
    layout: combineReducers({
      mainLayout: mainLayoutSlice.reducer,
    }),
  }),
  middleware: [routerMiddleware],
})

export const history = createReduxHistory(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
