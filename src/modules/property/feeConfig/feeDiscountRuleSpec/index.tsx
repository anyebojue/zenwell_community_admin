import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  FeeDiscountRuleSpecParams,
  FeeDiscountRuleSpecReply
} from 'api/model/property/feeConfig/feeDiscountRuleSpecModel'
import {
  FindFeeDiscountRuleSpec,
  CreateFeeDiscountRuleSpec,
  UpdateFeeDiscountRuleSpec,
  DeleteFeeDiscountRuleSpec
} from 'api/property/feeConfig/feeDiscountRuleSpec'

const namespace = 'FeeDiscountRuleSpec'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeDiscountRuleSpecReply[]
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
  async (params: FeeDiscountRuleSpecParams & PaginationParams) => {
    const res = await FindFeeDiscountRuleSpec(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: FeeDiscountRuleSpecParams) => {
    const res = await CreateFeeDiscountRuleSpec(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: FeeDiscountRuleSpecParams) => {
    const res = await UpdateFeeDiscountRuleSpec(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeDiscountRuleSpec(ids)
  return res
})

export const FeeDiscountRuleSpecSlice = createSlice({
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

export const { reset } = FeeDiscountRuleSpecSlice.actions

export const selectFeeDiscountRuleSpec = (state: RootState) => state.FeeDiscountRuleSpecSlice

export default FeeDiscountRuleSpecSlice.reducer
