import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { PayFeeBatchParams } from 'api/model/property/feeConfig/payFeeBatchModel'
import { PayFeeParams, PayFeeReply } from 'api/model/property/feeConfig/payFeeModel'
import {
  FindPayFee,
  CreatePayFee,
  UpdatePayFee,
  DeletePayFee,
  GetImportTemplate,
  PayFeesBatch
} from 'api/property/feeConfig/payFee'

const namespace = 'PayFee'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: PayFeeReply[]
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
  async (params: PayFeeParams & PaginationParams) => {
    const res = await FindPayFee(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: PayFeeParams) => {
  const res = await CreatePayFee(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: PayFeeParams) => {
  const res = await UpdatePayFee(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeletePayFee(ids)
  return res
})

export const getImportTemplate = createAsyncThunk(
  `${namespace}/get`,
  async (params: { configIds: string; floorIds: string; type: string }) => {
    const res = await GetImportTemplate(params)
    return res
  }
)

export const payFeesBatch = createAsyncThunk(
  `${namespace}/payFeesBatch`,
  async (data: PayFeeBatchParams) => {
    const res = await PayFeesBatch(data)
    return res
  }
)

export const PayFeeSlice = createSlice({
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

export const { reset } = PayFeeSlice.actions

export const selectPayFee = (state: RootState) => state.PayFeeSlice

export default PayFeeSlice.reducer
