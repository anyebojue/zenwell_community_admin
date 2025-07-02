import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  PayFeeDetailParams,
  PayFeeDetailReply
} from 'api/model/property/feeConfig/payFeeDetailModel'
import {
  FindPayFeeDetail,
  CreatePayFeeDetail,
  UpdatePayFeeDetail,
  DeletePayFeeDetail
} from 'api/property/feeConfig/payFeeDetail'

const namespace = 'PayFeeDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: PayFeeDetailReply[]
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
  async (params: PayFeeDetailParams & PaginationParams) => {
    const res = await FindPayFeeDetail(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: PayFeeDetailParams) => {
  const res = await CreatePayFeeDetail(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: PayFeeDetailParams) => {
  const res = await UpdatePayFeeDetail(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeletePayFeeDetail(ids)
  return res
})

export const PayFeeDetailSlice = createSlice({
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

export const { reset } = PayFeeDetailSlice.actions

export const selectPayFeeDetail = (state: RootState) => state.PayFeeDetailSlice

export default PayFeeDetailSlice.reducer
