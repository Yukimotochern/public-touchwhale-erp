// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
// import type { RootState, AppDispatch } from './store'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import type { RootState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = () => useDispatch<AppDispatch>() // wrong type
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
