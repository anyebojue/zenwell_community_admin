import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  PayFeeConfigDiscountParams,
  PayFeeConfigDiscountReply
} from 'api/model/property/feeConfig/payFeeConfigDiscountModel'
import {
  FindPayFeeConfigDiscount,
  CreatePayFeeConfigDiscount,
  UpdatePayFeeConfigDiscount,
  DeletePayFeeConfigDiscount
} from 'api/property/feeConfig/payFeeConfigDiscount'

const namespace = 'PayFeeConfigDiscount'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: PayFeeConfigDiscountReply[]
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
  async (params: PayFeeConfigDiscountParams & PaginationParams) => {
    const res = await FindPayFeeConfigDiscount(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: PayFeeConfigDiscountParams) => {
    const res = await CreatePayFeeConfigDiscount(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: PayFeeConfigDiscountParams) => {
    const res = await UpdatePayFeeConfigDiscount(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeletePayFeeConfigDiscount(ids)
  return res
})

export const PayFeeConfigDiscountSlice = createSlice({
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

export const { reset } = PayFeeConfigDiscountSlice.actions

export const selectPayFeeConfigDiscount = (state: RootState) => state.PayFeeConfigDiscountSlice

export default PayFeeConfigDiscountSlice.reducer
