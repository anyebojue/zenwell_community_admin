import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  FeeConfigLogParams,
  FeeConfigLogReply
} from 'api/model/property/feeConfig/feeConfigLogModel'
import {
  FindFeeConfigLog,
  CreateFeeConfigLog,
  UpdateFeeConfigLog,
  DeleteFeeConfigLog
} from 'api/property/feeConfig/feeConfigLog'

const namespace = 'FeeConfigLog'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeConfigLogReply[]
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
  async (params: FeeConfigLogParams & PaginationParams) => {
    const res = await FindFeeConfigLog(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: FeeConfigLogParams) => {
  const res = await CreateFeeConfigLog(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: FeeConfigLogParams) => {
  const res = await UpdateFeeConfigLog(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeConfigLog(ids)
  return res
})

export const FeeConfigLogSlice = createSlice({
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

export const { reset } = FeeConfigLogSlice.actions

export const selectFeeConfigLog = (state: RootState) => state.FeeConfigLogSlice

export default FeeConfigLogSlice.reducer
