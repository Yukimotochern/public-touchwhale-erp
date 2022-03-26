import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PlainUser } from 'api/dist/user/userTypes'
import { getUserUnchained } from '../../api/userActions'

interface AppAuthState {
  user?: PlainUser
  loading: boolean
  error?: any
}

const initialState: AppAuthState = {
  loading: true,
}

export const getUserThunkAction = createAsyncThunk('auth/getUser', async () => {
  const user = await getUserUnchained()
  return user
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<PlainUser>) => {
      state.user = action.payload
    },
    updateUserAvatar: (state, action: PayloadAction<PlainUser['avatar']>) => {
      if (state.user?.avatar) {
        state.user.avatar = action.payload
      }
    },
    signOut: (state) => {
      state.user = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserThunkAction.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(getUserThunkAction.pending, (state, action) => {
        state.loading = true
      })
      .addCase(getUserThunkAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
        state.user = undefined
      })
  },
})
