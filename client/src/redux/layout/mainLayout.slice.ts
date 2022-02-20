import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MainLayoutRouteState {
  loading: boolean
  error: string | null
  data: any
}

const initialState: MainLayoutRouteState = {
  loading: true,
  error: null,
  data: null,
}
