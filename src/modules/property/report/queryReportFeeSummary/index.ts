import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryReportFeeSummary } from 'api/property/report/queryReportFeeSummary'
import {
  QueryReportFeeSummaryReply,
  QueryReportFeeSummaryParams
} from 'api/model/property/report/queryReportFeeSummaryModel'

const namespace = 'queryReportFeeSummary'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryReportFeeSummaryReply[]
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
  async (params: QueryReportFeeSummaryParams & PaginationParams) => {
    const res = await FindQueryReportFeeSummary(params)
    return res
  }
)

export const QueryReportFeeSummarySlice = createSlice({
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
      state.exportUrl = action.payload.exportUrl
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = QueryReportFeeSummarySlice.actions

export const selectQueryReportFeeSummary = (state: RootState) => state.QueryReportFeeSummarySlice

export default QueryReportFeeSummarySlice.reducer
