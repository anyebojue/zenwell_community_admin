import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { DictParams, DictReply } from 'api/model/dictModel'
import { FindDict, CreateDict, UpdateDict, DeleteDict } from 'api/property/report/reportDict'

const namespace = 'ReportDict'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: DictReply[]
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
  async (params: DictParams & PaginationParams & { isExport?: boolean }) => {
    const res = await FindDict(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: DictParams) => {
  const res = await CreateDict(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: DictParams) => {
  const res = await UpdateDict(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteDict(ids)
  return res
})

export const ReportDictSlice = createSlice({
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
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = ReportDictSlice.actions

export const selectReportDict = (state: RootState) => state.ReportDictSlice

export default ReportDictSlice.reducer
