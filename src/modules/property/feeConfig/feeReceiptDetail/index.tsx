import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  FeeReceiptDetailParams,
  FeeReceiptDetailReply
} from 'api/model/property/feeConfig/feeReceiptDetailModel'
import {
  FindFeeReceiptDetail,
  CreateFeeReceiptDetail,
  UpdateFeeReceiptDetail,
  DeleteFeeReceiptDetail
} from 'api/property/feeConfig/feeReceiptDetail'

const namespace = 'FeeReceiptDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeReceiptDetailReply[]
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
  async (params: FeeReceiptDetailParams & PaginationParams) => {
    const res = await FindFeeReceiptDetail(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: FeeReceiptDetailParams) => {
    const res = await CreateFeeReceiptDetail(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: FeeReceiptDetailParams) => {
    const res = await UpdateFeeReceiptDetail(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeReceiptDetail(ids)
  return res
})

export const FeeReceiptDetailSlice = createSlice({
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

export const { reset } = FeeReceiptDetailSlice.actions

export const selectFeeReceiptDetail = (state: RootState) => state.FeeReceiptDetailSlice

export default FeeReceiptDetailSlice.reducer
