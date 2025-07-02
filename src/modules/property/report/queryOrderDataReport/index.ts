import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryOrderDataReport } from 'api/property/report/queryOrderDataReport'
import {
  QueryOrderDataReportReply,
  QueryOrderDataReportParams
} from 'api/model/property/report/queryOrderDataReportModel'

const namespace = 'queryOrderDataReport'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryOrderDataReportReply[]
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
  async (params: QueryOrderDataReportParams & PaginationParams & { isExport?: boolean }) => {
    const res = await FindQueryOrderDataReport(params)
    return res
  }
)

export const QueryOrderDataReportSlice = createSlice({
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

export const { reset } = QueryOrderDataReportSlice.actions

export const selectQueryOrderDataReport = (state: RootState) => state.QueryOrderDataReportSlice

export default QueryOrderDataReportSlice.reducer
