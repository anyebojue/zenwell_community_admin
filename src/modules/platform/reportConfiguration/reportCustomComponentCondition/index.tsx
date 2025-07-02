import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ReportCustomComponentConditionParams,
  ReportCustomComponentConditionReply
} from 'api/model/platform/reportConfiguration/reportCustomComponentConditionModel'
import {
  FindReportCustomComponentCondition,
  CreateReportCustomComponentCondition,
  UpdateReportCustomComponentCondition,
  DeleteReportCustomComponentCondition
} from 'api/platform/reportConfiguration/reportCustomComponentCondition'

const namespace = 'ReportCustomComponentCondition'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReportCustomComponentConditionReply[]
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
  async (params: ReportCustomComponentConditionParams & PaginationParams) => {
    const res = await FindReportCustomComponentCondition(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ReportCustomComponentConditionParams) => {
    const res = await CreateReportCustomComponentCondition(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ReportCustomComponentConditionParams) => {
    const res = await UpdateReportCustomComponentCondition(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteReportCustomComponentCondition(ids)
  return res
})

export const ReportCustomComponentConditionSlice = createSlice({
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

export const { reset } = ReportCustomComponentConditionSlice.actions

export const selectReportCustomComponentCondition = (state: RootState) =>
  state.ReportCustomComponentConditionSlice

export default ReportCustomComponentConditionSlice.reducer
