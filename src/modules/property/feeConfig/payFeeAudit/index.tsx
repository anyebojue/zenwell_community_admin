import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { PayFeeAuditParams, PayFeeAuditReply } from 'api/model/property/feeConfig/payFeeAuditModel'
import {
  FindPayFeeAudit,
  CreatePayFeeAudit,
  UpdatePayFeeAudit,
  DeletePayFeeAudit
} from 'api/property/feeConfig/payFeeAudit'

const namespace = 'PayFeeAudit'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: PayFeeAuditReply[]
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
  async (params: PayFeeAuditParams & PaginationParams) => {
    const res = await FindPayFeeAudit(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: PayFeeAuditParams) => {
  const res = await CreatePayFeeAudit(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: PayFeeAuditParams) => {
  const res = await UpdatePayFeeAudit(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeletePayFeeAudit(ids)
  return res
})

export const PayFeeAuditSlice = createSlice({
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

export const { reset } = PayFeeAuditSlice.actions

export const selectPayFeeAudit = (state: RootState) => state.PayFeeAuditSlice

export default PayFeeAuditSlice.reducer
