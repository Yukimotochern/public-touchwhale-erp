import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { pureAppRoutes } from '../AppRoutes'

export const routeLinkSlice = createSlice({
  name: 'mainLayoutRoute',
  initialState: pureAppRoutes,
  reducers: {},
})
