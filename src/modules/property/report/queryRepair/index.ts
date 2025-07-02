import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryRepair } from 'api/property/report/queryRepair'
import {
  QueryRepairReply,
  QueryRepairParams,
  Rep,
  SumTotal
} from 'api/model/property/report/queryRepairModel'

const namespace = 'queryRepair'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryRepairReply[]
  exportUrl: string
  rep: Rep
  sumTotal: SumTotal[]
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
  rep: {},
  sumTotal: []
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: QueryRepairParams & PaginationParams) => {
    const res = await FindQueryRepair(params)
    return res
  }
)

export const QueryRepairSlice = createSlice({
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
      state.rep = action.payload.rep
      state.sumTotal = action.payload.sumTotal
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = QueryRepairSlice.actions

export const selectQueryRepair = (state: RootState) => state.QueryRepairSlice

export default QueryRepairSlice.reducer
