import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FeeConfigParams, FeeConfigReply } from 'api/model/property/feeConfig/feeConfigModel'
import {
  FindFeeConfig,
  CreateFeeConfig,
  UpdateFeeConfig,
  DeleteFeeConfig
} from 'api/property/feeConfig/feeConfig'

const namespace = 'FeeConfig'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeConfigReply[]
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
  async (params: FeeConfigParams & PaginationParams) => {
    const res = await FindFeeConfig(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: FeeConfigParams) => {
  const res = await CreateFeeConfig(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: FeeConfigParams) => {
  const res = await UpdateFeeConfig(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeConfig(ids)
  return res
})

export const FeeConfigSlice = createSlice({
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

export const { reset } = FeeConfigSlice.actions

export const selectFeeConfig = (state: RootState) => state.FeeConfigSlice

export default FeeConfigSlice.reducer
