import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import {
  getRegularUserResValidator,
  IRegularUserRes,
} from '../../res/regularUserValidate'
import { message } from 'antd'

interface AppAuthState {
  user?: IRegularUserRes
  loading: boolean
  error?: any
}

const initialState: AppAuthState = {
  loading: true,
}

export const getRegularUser = createAsyncThunk(
  'auth/getRegularUser',
  async () => {
    const { data } = await api.get('/regularUser/')
    const resData = data.data
    if (getRegularUserResValidator(resData)) {
      return resData
    } else {
      console.log(resData)
      message.error('Something Went Wrong!')
      throw Error('Invalid Response From Server')
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRegularUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(getRegularUser.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getRegularUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
  },
})
