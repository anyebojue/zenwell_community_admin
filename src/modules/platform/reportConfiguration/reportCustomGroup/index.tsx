import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ReportCustomGroupParams,
  ReportCustomGroupReply
} from 'api/model/platform/reportConfiguration/reportCustomGroupModel'
import {
  FindReportCustomGroup,
  CreateReportCustomGroup,
  UpdateReportCustomGroup,
  DeleteReportCustomGroup
} from 'api/platform/reportConfiguration/reportCustomGroup'

const namespace = 'ReportCustomGroup'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReportCustomGroupReply[]
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
  async (params: ReportCustomGroupParams & PaginationParams) => {
    const res = await FindReportCustomGroup(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ReportCustomGroupParams) => {
    const res = await CreateReportCustomGroup(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ReportCustomGroupParams) => {
    const res = await UpdateReportCustomGroup(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteReportCustomGroup(ids)
  return res
})

export const ReportCustomGroupSlice = createSlice({
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

export const { reset } = ReportCustomGroupSlice.actions

export const selectReportCustomGroup = (state: RootState) => state.ReportCustomGroupSlice

export default ReportCustomGroupSlice.reducer
