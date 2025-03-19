import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ReportCustomComponentParams,
  ReportCustomComponentReply
} from 'api/model/platform/reportConfiguration/reportCustomComponentModel'
import {
  FindReportCustomComponent,
  CreateReportCustomComponent,
  UpdateReportCustomComponent,
  DeleteReportCustomComponent
} from 'api/platform/reportConfiguration/reportCustomComponent'

const namespace = 'ReportCustomComponent'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReportCustomComponentReply[]
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
  async (params: ReportCustomComponentParams & PaginationParams) => {
    const res = await FindReportCustomComponent(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ReportCustomComponentParams) => {
    const res = await CreateReportCustomComponent(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ReportCustomComponentParams) => {
    const res = await UpdateReportCustomComponent(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteReportCustomComponent(ids)
  return res
})

export const ReportCustomComponentSlice = createSlice({
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

export const { reset } = ReportCustomComponentSlice.actions

export const selectReportCustomComponent = (state: RootState) => state.ReportCustomComponentSlice

export default ReportCustomComponentSlice.reducer
