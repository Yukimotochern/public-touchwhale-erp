import { createSlice, createAction } from '@reduxjs/toolkit'
import { mainRouteLinks, RouteLink } from '../routes/appLink'
import { LOCATION_CHANGE } from 'redux-first-history'
export const routeAction = createAction<{
  location: Location
}>(LOCATION_CHANGE)

export const routeLinkSlice = createSlice({
  name: 'mainLayoutRoute',
  initialState: mainRouteLinks,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(routeAction, (state, action) => {
      const destinationPathName = action.payload.location.pathname
      const destinationPathArray = destinationPathName.split('/').slice(1)
      let routerLink: RouteLink[] = state
      let thisLevelMatchedRouteLink: RouteLink | undefined
      for (let level = 0; level < destinationPathArray.length; level++) {
        let linkToMatch: string = destinationPathArray[level]
        thisLevelMatchedRouteLink = routerLink.find(
          (ob) => ob.path.replace('/', '') === linkToMatch
        )

        if (thisLevelMatchedRouteLink) {
          thisLevelMatchedRouteLink.link = destinationPathArray
          if (thisLevelMatchedRouteLink.children) {
            routerLink = thisLevelMatchedRouteLink.children
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
