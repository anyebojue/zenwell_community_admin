import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryMonthReceivedDetail } from 'api/property/report/queryMonthReceivedDetail'
import {
  QueryMonthReceivedDetailReply,
  QueryMonthReceivedDetailParams
} from 'api/model/property/report/queryMonthReceivedDetailModel'

const namespace = 'queryMonthReceivedDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryMonthReceivedDetailReply[]
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
  async (params: QueryMonthReceivedDetailParams & PaginationParams & { isExport?: boolean }) => {
    const res = await FindQueryMonthReceivedDetail(params)
    return res
  }
)

export const QueryMonthReceivedDetailSlice = createSlice({
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

export const { reset } = QueryMonthReceivedDetailSlice.actions

export const selectQueryMonthReceivedDetail = (state: RootState) =>
  state.QueryMonthReceivedDetailSlice

export default QueryMonthReceivedDetailSlice.reducer
