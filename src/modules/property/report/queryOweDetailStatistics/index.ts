import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryOweDetailStatistics } from 'api/property/report/queryOweDetailStatistics'
import {
  QueryOweDetailStatisticsReply,
  QueryOweDetailStatisticsParams
} from 'api/model/property/report/queryOweDetailStatisticsModel'

const namespace = 'queryOweDetailStatistics'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryOweDetailStatisticsReply[]
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
  async (params: QueryOweDetailStatisticsParams & PaginationParams & { isExport?: boolean }) => {
    const res = await FindQueryOweDetailStatistics(params)
    return res
  }
)

export const QueryOweDetailStatisticsSlice = createSlice({
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

export const { reset } = QueryOweDetailStatisticsSlice.actions

export const selectQueryOweDetailStatistics = (state: RootState) =>
  state.QueryOweDetailStatisticsSlice

export default QueryOweDetailStatisticsSlice.reducer
