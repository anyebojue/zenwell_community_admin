import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FeeDiscountParams, FeeDiscountReply } from 'api/model/property/feeConfig/feeDiscountModel'
import {
  FindFeeDiscount,
  CreateFeeDiscount,
  UpdateFeeDiscount,
  DeleteFeeDiscount
} from 'api/property/feeConfig/feeDiscount'

const namespace = 'FeeDiscount'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeDiscountReply[]
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
  async (params: FeeDiscountParams & PaginationParams) => {
    const res = await FindFeeDiscount(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: FeeDiscountParams) => {
  const res = await CreateFeeDiscount(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: FeeDiscountParams) => {
  const res = await UpdateFeeDiscount(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeDiscount(ids)
  return res
})

export const FeeDiscountSlice = createSlice({
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

export const { reset } = FeeDiscountSlice.actions

export const selectFeeDiscount = (state: RootState) => state.FeeDiscountSlice

export default FeeDiscountSlice.reducer
