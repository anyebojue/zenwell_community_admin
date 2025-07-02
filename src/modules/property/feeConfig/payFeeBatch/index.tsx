import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { PayFeeBatchParams, PayFeeBatchReply } from 'api/model/property/feeConfig/payFeeBatchModel'
import {
  FindPayFeeBatch,
  CreatePayFeeBatch,
  UpdatePayFeeBatch,
  DeletePayFeeBatch
} from 'api/property/feeConfig/payFeeBatch'

const namespace = 'PayFeeBatch'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: PayFeeBatchReply[]
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
  async (params: PayFeeBatchParams & PaginationParams) => {
    const res = await FindPayFeeBatch(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: PayFeeBatchParams) => {
  const res = await CreatePayFeeBatch(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: PayFeeBatchParams) => {
  const res = await UpdatePayFeeBatch(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeletePayFeeBatch(ids)
  return res
})

export const PayFeeBatchSlice = createSlice({
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

export const { reset } = PayFeeBatchSlice.actions

export const selectPayFeeBatch = (state: RootState) => state.PayFeeBatchSlice

export default PayFeeBatchSlice.reducer
