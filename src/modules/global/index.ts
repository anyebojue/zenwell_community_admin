import { createSlice } from '@reduxjs/toolkit'

export interface GlobalType {}

const initialState: GlobalType = {}

export const GlobalState = createSlice({
  name: 'GlobalState',
  initialState,
  reducers: {}
})

export default GlobalState.reducer
