import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { ParkingAreaParams, ParkingAreaReply } from 'api/model/property/parking/parkingAreaModel'
import {
  FindParkingArea,
  CreateParkingArea,
  UpdateParkingArea,
  DeleteParkingArea
} from 'api/property/parking/parkingArea'

const namespace = 'ParkingArea'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ParkingAreaReply[]
  parkingArea: ParkingAreaReply
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  parkingArea: {}
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: ParkingAreaParams & PaginationParams) => {
    const res = await FindParkingArea(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: ParkingAreaParams) => {
  const res = await CreateParkingArea(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: ParkingAreaParams) => {
  const res = await UpdateParkingArea(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteParkingArea(ids)
  return res
})

export const ParkingAreaSlice = createSlice({
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

export const { reset } = ParkingAreaSlice.actions

export const selectParkingArea = (state: RootState) => state.ParkingAreaSlice

export default ParkingAreaSlice.reducer
