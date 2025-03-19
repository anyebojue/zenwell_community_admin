import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ReportCustomParams,
  ReportCustomReply
} from 'api/model/platform/reportConfiguration/reportCustomModel'
import {
  FindReportCustom,
  CreateReportCustom,
  UpdateReportCustom,
  DeleteReportCustom
} from 'api/platform/reportConfiguration/reportCustom'

const namespace = 'ReportCustom'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReportCustomReply[]
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
  async (params: ReportCustomParams & PaginationParams) => {
    const res = await FindReportCustom(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: ReportCustomParams) => {
  const res = await CreateReportCustom(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: ReportCustomParams) => {
  const res = await UpdateReportCustom(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteReportCustom(ids)
  return res
})

export const ReportCustomSlice = createSlice({
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

export const { reset } = ReportCustomSlice.actions

export const selectReportCustom = (state: RootState) => state.ReportCustomSlice

export default ReportCustomSlice.reducer
