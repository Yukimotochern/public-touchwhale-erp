import { createSlice, createAction } from '@reduxjs/toolkit'
import { pureRouteObjectWithLink, PureRouteObjectWithLink } from '../AppRoutes'
import { LOCATION_CHANGE } from 'redux-first-history'
const routeAction = createAction<{
  location: Location
}>(LOCATION_CHANGE)

export const routeLinkSlice = createSlice({
  name: 'mainLayoutRoute',
  initialState: pureRouteObjectWithLink,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(routeAction, (state, action) => {
      const pathName = action.payload.location.pathname
      const destinationPathArray = pathName.split('/').filter((s) => !!s)
      let routerLink: PureRouteObjectWithLink[] = state
      let pRoute: PureRouteObjectWithLink | undefined
      for (let level = 0; level < destinationPathArray.length; level++) {
        let linkToMatch: string = destinationPathArray[level]
        pRoute = routerLink.find(
          (ob) => ob.path.replace('/', '') === linkToMatch
        )

        if (pRoute) {
          pRoute.link = destinationPathArray.map((s, ind) =>
            ind === 0 ? '/' + s : s
          )
          if (pRoute.children) {
            routerLink = pRoute.children
          } else {
            break
          }
        } else {
          break
        }
      }
    })
  },
})
