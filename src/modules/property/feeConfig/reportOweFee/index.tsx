import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ReportOweFeeParams,
  ReportOweFeeReply
} from 'api/model/property/feeConfig/reportOweFeeModel'
import {
  FindReportOweFee,
  CreateReportOweFee,
  UpdateReportOweFee,
  DeleteReportOweFee
} from 'api/property/feeConfig/reportOweFee'

const namespace = 'ReportOweFee'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReportOweFeeReply[]
  exportUrl: string
  sum: string
  allSum: string
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
  sum: '',
  allSum: ''
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (
    params: ReportOweFeeParams &
      PaginationParams & { is_export?: boolean; sum?: string; allSum?: string }
  ) => {
    const res = await FindReportOweFee(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: ReportOweFeeParams) => {
  const res = await CreateReportOweFee(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: ReportOweFeeParams) => {
  const res = await UpdateReportOweFee(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteReportOweFee(ids)
  return res
})

export const ReportOweFeeSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: builder => {
    builder
    // 请求加载时的数据
    builder.addCase(find.pending, state => {
      state.list = []
    })
    // 请求成功的数据
    builder.addCase(find.fulfilled, (state, action) => {
      state.page = action.payload.page
      state.list = action.payload.list
      state.exportUrl = action.payload.exportUrl
      state.sum = action.payload.sum
      state.allSum = action.payload.allSum
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = ReportOweFeeSlice.actions

export const selectReportOweFee = (state: RootState) => state.ReportOweFeeSlice

export default ReportOweFeeSlice.reducer
