import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RemainingParkingSpaceReply } from 'api/model/property/parking/remainingParkingSpaceModel'
import { FindRemainingParkingSpace } from 'api/property/parking/remainingParkingSpace'

const namespace = 'RemainingParkingSpace'

interface IInitialState {
  list: RemainingParkingSpaceReply[]
}

const initialState: IInitialState = {
  list: []
}

export const find = createAsyncThunk(`${namespace}/find`, async () => {
  const res = await FindRemainingParkingSpace()
  return res
})

export const RemainingParkingSpaceSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: builder => {
    builder
    // 请求加载时的数据
    builder.addCase(find.pending, state => {
      state.list = []
    })
    // 请求成功的数据
    builder.addCase(find.fulfilled, (state, action) => {
      state.list = [{ id: '1', ...action.payload }]
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = RemainingParkingSpaceSlice.actions

export const selectRemainingParkingSpace = (state: RootState) => state.RemainingParkingSpaceSlice

export default RemainingParkingSpaceSlice.reducer
