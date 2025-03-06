import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryPayFeeDetail } from 'api/property/report/queryPayFeeDetail'
import {
  QueryPayFeeDetailParams,
  QueryPayFeeDetailReply,
  SumTotal
} from 'api/model/property/report/queryPayFeeDetailModel'

const namespace = 'queryPayFeeDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryPayFeeDetailReply[]
  exportUrl: string
  sumTotal: SumTotal
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  exportUrl: '',
  sumTotal: {}
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (
    params: QueryPayFeeDetailParams & PaginationParams & { isExport?: boolean; sumTotal?: SumTotal }
  ) => {
    const res = await FindQueryPayFeeDetail(params)
    return res
  }
)

export const QueryPayFeeDetailSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: builder => {
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

export const { reset } = QueryPayFeeDetailSlice.actions

export const selectQueryPayFeeDetail = (state: RootState) => state.QueryPayFeeDetailSlice

export default QueryPayFeeDetailSlice.reducer
