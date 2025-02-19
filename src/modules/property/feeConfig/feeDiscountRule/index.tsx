import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  FeeDiscountRuleParams,
  FeeDiscountRuleReply
} from 'api/model/property/feeConfig/feeDiscountRuleModel'
import {
  FindFeeDiscountRule,
  CreateFeeDiscountRule,
  UpdateFeeDiscountRule,
  DeleteFeeDiscountRule
} from 'api/property/feeConfig/feeDiscountRule'

const namespace = 'FeeDiscountRule'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeDiscountRuleReply[]
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
  async (params: FeeDiscountRuleParams & PaginationParams) => {
    const res = await FindFeeDiscountRule(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: FeeDiscountRuleParams) => {
    const res = await CreateFeeDiscountRule(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: FeeDiscountRuleParams) => {
    const res = await UpdateFeeDiscountRule(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeDiscountRule(ids)
  return res
})

export const FeeDiscountRuleSlice = createSlice({
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

export const { reset } = FeeDiscountRuleSlice.actions

export const selectFeeDiscountRule = (state: RootState) => state.FeeDiscountRuleSlice

export default FeeDiscountRuleSlice.reducer
