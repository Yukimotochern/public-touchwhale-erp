import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
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

export const getRegularUser = createAsyncThunk('auth/getUser', async () => {
  const { data } = await api.get('/user/')
  const resData = data.data
  if (getRegularUserResValidator(resData)) {
    return resData
  } else {
    console.log(resData)
    message.error('Something Went Wrong!')
    throw Error('Invalid Response From Server')
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateRegularUser: (state, action: PayloadAction<IRegularUserRes>) => {
      state.user = action.payload
    },
    updateRegularUserAvatar: (
      state,
      action: PayloadAction<IRegularUserRes['avatar']>
    ) => {
      if (state.user?.avatar) {
        state.user.avatar = action.payload
      }
    },
  },
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
        state.user = undefined
      })
  },
})
