import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { pureAppRoutes } from '../AppRoutes'

export const mainLayoutRouteState = createSlice({
  name: 'mainLayoutRoute',
  initialState: pureAppRoutes,
  reducers: {},
})
