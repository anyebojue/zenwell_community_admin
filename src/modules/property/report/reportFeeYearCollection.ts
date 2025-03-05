import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ReportFeeYearCollectionParams,
  ReportFeeYearCollectionReply
} from 'api/model/property/report/reportFeeYearCollectionModel'
import {
  FindReportFeeYearCollection,
  CreateReportFeeYearCollection,
  UpdateReportFeeYearCollection,
  DeleteReportFeeYearCollection
} from 'api/property/report/reportFeeYearCollection'

const namespace = 'ReportFeeYearCollection'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReportFeeYearCollectionReply[]
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
  async (params: ReportFeeYearCollectionParams & PaginationParams & { isExport?: boolean }) => {
    const res = await FindReportFeeYearCollection(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ReportFeeYearCollectionParams) => {
    const res = await CreateReportFeeYearCollection(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ReportFeeYearCollectionParams) => {
    const res = await UpdateReportFeeYearCollection(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteReportFeeYearCollection(ids)
  return res
})

export const ReportFeeYearCollectionSlice = createSlice({
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

export const { reset } = ReportFeeYearCollectionSlice.actions

export const selectReportFeeYearCollection = (state: RootState) =>
  state.ReportFeeYearCollectionSlice

export default ReportFeeYearCollectionSlice.reducer
