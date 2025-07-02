import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { ParkingBoxParams, ParkingBoxReply } from 'api/model/property/parking/parkingBoxModel'
import {
  FindParkingBox,
  CreateParkingBox,
  UpdateParkingBox,
  DeleteParkingBox
} from 'api/property/parking/parkingBox'

const namespace = 'ParkingBox'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ParkingBoxReply[]
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: []
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: ParkingBoxParams & PaginationParams) => {
    const res = await FindParkingBox(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: ParkingBoxParams) => {
  const res = await CreateParkingBox(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: ParkingBoxParams) => {
  const res = await UpdateParkingBox(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteParkingBox(ids)
  return res
})

export const ParkingBoxSlice = createSlice({
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
      state.page = action.payload.page
      state.list = action.payload.list
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = ParkingBoxSlice.actions

export const selectParkingBox = (state: RootState) => state.ParkingBoxSlice

export default ParkingBoxSlice.reducer
