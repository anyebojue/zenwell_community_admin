import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  PurchaseApplyDetailParams,
  PurchaseApplyDetailReply
} from 'api/model/property/purchase/purchaseApplyDetailModel'
import {
  FindPurchaseApplyDetail,
  CreatePurchaseApplyDetail,
  UpdatePurchaseApplyDetail,
  DeletePurchaseApplyDetail
} from 'api/property/purchase/purchaseApplyDetail'

const namespace = 'PurchaseApplyDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: PurchaseApplyDetailReply[]
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
  async (params: PurchaseApplyDetailParams & PaginationParams) => {
    const res = await FindPurchaseApplyDetail(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: PurchaseApplyDetailParams) => {
    const res = await CreatePurchaseApplyDetail(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: PurchaseApplyDetailParams) => {
    const res = await UpdatePurchaseApplyDetail(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeletePurchaseApplyDetail(ids)
  return res
})

export const PurchaseApplyDetailSlice = createSlice({
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

export const { reset } = PurchaseApplyDetailSlice.actions

export const selectPurchaseApplyDetail = (state: RootState) => state.PurchaseApplyDetailSlice

export default PurchaseApplyDetailSlice.reducer
