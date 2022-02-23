import { createSlice } from '@reduxjs/toolkit'

interface mayLayoutState {
  siderOpen: boolean
}

const initialState: mayLayoutState = {
  siderOpen: true,
}

export const mainLayoutSlice = createSlice({
  name: 'layout/mainLayout',
  initialState,
  reducers: {
    toggle(state) {
      state.siderOpen = !state.siderOpen
    },
  },
})

export const { toggle } = mainLayoutSlice.actions
