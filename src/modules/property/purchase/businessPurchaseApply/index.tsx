import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  BusinessPurchaseApplyParams,
  BusinessPurchaseApplyReply
} from 'api/model/property/purchase/businessPurchaseApplyModel'
import {
  FindBusinessPurchaseApply,
  CreateBusinessPurchaseApply,
  UpdateBusinessPurchaseApply,
  DeleteBusinessPurchaseApply
} from 'api/property/purchase/businessPurchaseApply'

const namespace = 'BusinessPurchaseApply'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: BusinessPurchaseApplyReply[]
  exportUrl: string
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  exportUrl: ''
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: BusinessPurchaseApplyParams & PaginationParams) => {
    const res = await FindBusinessPurchaseApply(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: BusinessPurchaseApplyParams) => {
    const res = await CreateBusinessPurchaseApply(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: BusinessPurchaseApplyParams) => {
    const res = await UpdateBusinessPurchaseApply(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteBusinessPurchaseApply(ids)
  return res
})

export const BusinessPurchaseApplySlice = createSlice({
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
      state.exportUrl = action.payload.exportUrl
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = BusinessPurchaseApplySlice.actions

export const selectBusinessPurchaseApply = (state: RootState) => state.BusinessPurchaseApplySlice

export default BusinessPurchaseApplySlice.reducer
