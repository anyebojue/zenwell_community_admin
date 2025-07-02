import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryReceivedDetailStatistics } from 'api/property/report/queryReceivedDetailStatistics'
import {
  QueryReceivedDetailStatisticsReply,
  QueryReceivedDetailStatisticsParams
} from 'api/model/property/report/queryReceivedDetailStatisticsModel'

const namespace = 'queryReceivedDetailStatistics'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryReceivedDetailStatisticsReply[]
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
  async (
    params: QueryReceivedDetailStatisticsParams & PaginationParams & { isExport?: boolean }
  ) => {
    const res = await FindQueryReceivedDetailStatistics(params)
    return res
  }
)

export const QueryReceivedDetailStatisticsSlice = createSlice({
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

export const { reset } = QueryReceivedDetailStatisticsSlice.actions

export const selectQueryReceivedDetailStatistics = (state: RootState) =>
  state.QueryReceivedDetailStatisticsSlice

export default QueryReceivedDetailStatisticsSlice.reducer
