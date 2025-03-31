import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { CarInoutParams, CarInoutReply } from 'api/model/property/parking/carInoutModel'
import {
  FindCarInout,
  CreateCarInout,
  UpdateCarInout,
  DeleteCarInout
} from 'api/property/parking/carInout'

const namespace = 'CarInout'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: CarInoutReply[]
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
  async (params: CarInoutParams & PaginationParams) => {
    const res = await FindCarInout(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: CarInoutParams) => {
  const res = await CreateCarInout(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: CarInoutParams) => {
  const res = await UpdateCarInout(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteCarInout(ids)
  return res
})

export const CarInoutSlice = createSlice({
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

export const { reset } = CarInoutSlice.actions

export const selectCarInout = (state: RootState) => state.CarInoutSlice

export default CarInoutSlice.reducer
