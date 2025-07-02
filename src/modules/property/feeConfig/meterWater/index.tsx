import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { MeterWaterParams, MeterWaterReply } from 'api/model/property/feeConfig/meterWaterModel'
import {
  FindMeterWater,
  CreateMeterWater,
  UpdateMeterWater,
  DeleteMeterWater
} from 'api/property/feeConfig/meterWater'

const namespace = 'MeterWater'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: MeterWaterReply[]
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
  async (params: MeterWaterParams & PaginationParams) => {
    const res = await FindMeterWater(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: MeterWaterParams) => {
  const res = await CreateMeterWater(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: MeterWaterParams) => {
  const res = await UpdateMeterWater(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteMeterWater(ids)
  return res
})

export const MeterWaterSlice = createSlice({
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

export const { reset } = MeterWaterSlice.actions

export const selectMeterWater = (state: RootState) => state.MeterWaterSlice

export default MeterWaterSlice.reducer
