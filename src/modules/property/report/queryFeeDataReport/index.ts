import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryFeeDataReport } from 'api/property/report/queryFeeDataReport'
import {
  QueryFeeDataReportReply,
  QueryFeeDataReportParams
} from 'api/model/property/report/queryFeeDataReportModel'

const namespace = 'queryFeeDataReport'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryFeeDataReportReply[]
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
  async (params: QueryFeeDataReportParams & PaginationParams & { isExport?: boolean }) => {
    const res = await FindQueryFeeDataReport(params)
    return res
  }
)

export const QueryFeeDataReportSlice = createSlice({
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

export const { reset } = QueryFeeDataReportSlice.actions

export const selectQueryFeeDataReport = (state: RootState) => state.QueryFeeDataReportSlice

export default QueryFeeDataReportSlice.reducer
