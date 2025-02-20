import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { MeterTypeParams, MeterTypeReply } from 'api/model/property/feeConfig/meterTypeModel'
import {
  FindMeterType,
  CreateMeterType,
  UpdateMeterType,
  DeleteMeterType
} from 'api/property/feeConfig/meterType'

const namespace = 'MeterType'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: MeterTypeReply[]
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
  async (params: MeterTypeParams & PaginationParams) => {
    const res = await FindMeterType(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: MeterTypeParams) => {
  const res = await CreateMeterType(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: MeterTypeParams) => {
  const res = await UpdateMeterType(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteMeterType(ids)
  return res
})

export const MeterTypeSlice = createSlice({
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

export const { reset } = MeterTypeSlice.actions

export const selectMeterType = (state: RootState) => state.MeterTypeSlice

export default MeterTypeSlice.reducer
