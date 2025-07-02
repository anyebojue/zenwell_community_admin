import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  FeeImportDetailParams,
  FeeImportDetailReply
} from 'api/model/property/feeConfig/feeImportDetailModel'
import {
  FindFeeImportDetail,
  CreateFeeImportDetail,
  UpdateFeeImportDetail,
  DeleteFeeImportDetail
} from 'api/property/feeConfig/feeImportDetail'

const namespace = 'FeeImportDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeImportDetailReply[]
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
  async (params: FeeImportDetailParams & PaginationParams) => {
    const res = await FindFeeImportDetail(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: FeeImportDetailParams) => {
    const res = await CreateFeeImportDetail(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: FeeImportDetailParams) => {
    const res = await UpdateFeeImportDetail(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeImportDetail(ids)
  return res
})

export const FeeImportDetailSlice = createSlice({
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

export const { reset } = FeeImportDetailSlice.actions

export const selectFeeImportDetail = (state: RootState) => state.FeeImportDetailSlice

export default FeeImportDetailSlice.reducer
