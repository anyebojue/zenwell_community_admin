import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ReportCustomComponentRelParams,
  ReportCustomComponentRelReply
} from 'api/model/platform/reportConfiguration/reportCustomComponentRelModel'
import {
  FindReportCustomComponentRel,
  CreateReportCustomComponentRel,
  UpdateReportCustomComponentRel,
  DeleteReportCustomComponentRel
} from 'api/platform/reportConfiguration/reportCustomComponentRel'

const namespace = 'ReportCustomComponentRel'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReportCustomComponentRelReply[]
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
  async (params: ReportCustomComponentRelParams & PaginationParams) => {
    const res = await FindReportCustomComponentRel(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ReportCustomComponentRelParams) => {
    const res = await CreateReportCustomComponentRel(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ReportCustomComponentRelParams) => {
    const res = await UpdateReportCustomComponentRel(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteReportCustomComponentRel(ids)
  return res
})

export const ReportCustomComponentRelSlice = createSlice({
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

export const { reset } = ReportCustomComponentRelSlice.actions

export const selectReportCustomComponentRel = (state: RootState) =>
  state.ReportCustomComponentRelSlice

export default ReportCustomComponentRelSlice.reducer
