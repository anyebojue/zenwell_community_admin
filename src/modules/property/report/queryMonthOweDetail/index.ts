import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryMonthOweDetail } from 'api/property/report/queryMonthOweDetail'
import {
  QueryMonthOweDetailReply,
  QueryMonthOweDetailParams
} from 'api/model/property/report/queryMonthOweDetailModel'

const namespace = 'queryMonthOweDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryMonthOweDetailReply[]
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
  async (params: QueryMonthOweDetailParams & PaginationParams & { isExport?: boolean }) => {
    const res = await FindQueryMonthOweDetail(params)
    return res
  }
)

export const QueryMonthOweDetailSlice = createSlice({
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

export const { reset } = QueryMonthOweDetailSlice.actions

export const selectQueryMonthOweDetail = (state: RootState) => state.QueryMonthOweDetailSlice

export default QueryMonthOweDetailSlice.reducer
