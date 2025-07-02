import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryInoutDataReport } from 'api/property/report/queryInoutDataReport'
import {
  QueryInoutDataReportReply,
  QueryInoutDataReportParams
} from 'api/model/property/report/queryInoutDataReportModel'

const namespace = 'queryInoutDataReport'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryInoutDataReportReply[]
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
  async (params: QueryInoutDataReportParams & PaginationParams & { isExport?: boolean }) => {
    const res = await FindQueryInoutDataReport(params)
    return res
  }
)

export const QueryInoutDataReportSlice = createSlice({
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

export const { reset } = QueryInoutDataReportSlice.actions

export const selectQueryInoutDataReport = (state: RootState) => state.QueryInoutDataReportSlice

export default QueryInoutDataReportSlice.reducer
