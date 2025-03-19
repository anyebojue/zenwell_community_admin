import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ReportCustomComponentFooterParams,
  ReportCustomComponentFooterReply
} from 'api/model/platform/reportConfiguration/reportCustomComponentFooterModel'
import {
  FindReportCustomComponentFooter,
  CreateReportCustomComponentFooter,
  UpdateReportCustomComponentFooter,
  DeleteReportCustomComponentFooter
} from 'api/platform/reportConfiguration/reportCustomComponentFooter'

const namespace = 'ReportCustomComponentFooter'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReportCustomComponentFooterReply[]
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
  async (params: ReportCustomComponentFooterParams & PaginationParams) => {
    const res = await FindReportCustomComponentFooter(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ReportCustomComponentFooterParams) => {
    const res = await CreateReportCustomComponentFooter(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ReportCustomComponentFooterParams) => {
    const res = await UpdateReportCustomComponentFooter(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteReportCustomComponentFooter(ids)
  return res
})

export const ReportCustomComponentFooterSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(find.fulfilled, (state, action) => {
      state.page = action.payload.page
      state.list = action.payload.list
    })
  }
})

export const { reset } = ReportCustomComponentFooterSlice.actions

export const selectReportCustomComponentFooter = (state: RootState) =>
  state.ReportCustomComponentFooterSlice

export default ReportCustomComponentFooterSlice.reducer
