import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FeeReceiptParams, FeeReceiptReply } from 'api/model/property/feeConfig/feeReceiptModel'
import {
  FindFeeReceipt,
  CreateFeeReceipt,
  UpdateFeeReceipt,
  DeleteFeeReceipt
} from 'api/property/feeConfig/feeReceipt'

const namespace = 'FeeReceipt'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeReceiptReply[]
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
  async (params: FeeReceiptParams & PaginationParams) => {
    const res = await FindFeeReceipt(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: FeeReceiptParams) => {
  const res = await CreateFeeReceipt(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: FeeReceiptParams) => {
  const res = await UpdateFeeReceipt(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeReceipt(ids)
  return res
})

export const FeeReceiptSlice = createSlice({
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

export const { reset } = FeeReceiptSlice.actions

export const selectFeeReceipt = (state: RootState) => state.FeeReceiptSlice

export default FeeReceiptSlice.reducer
