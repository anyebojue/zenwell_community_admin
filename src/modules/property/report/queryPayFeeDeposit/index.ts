import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryPayFeeDeposit } from 'api/property/report/queryPayFeeDeposit'
import {
  ReportFeeYearCollectionDetailReply,
  SumTotal
} from 'api/model/property/report/queryPayFeeDepositModel'

const namespace = 'ReportQueryPayFeeDeposit'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReportFeeYearCollectionDetailReply[]
  exportUrl: string
  sumTotal: SumTotal
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
  sumTotal: {}
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (
    params: ReportFeeYearCollectionDetailReply &
      PaginationParams & { isExport?: boolean; sumTotal?: SumTotal }
  ) => {
    const res = await FindQueryPayFeeDeposit(params)
    return res
  }
)

export const ReportQueryPayFeeDepositSlice = createSlice({
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
      state.sumTotal = action.payload.sumTotal
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = ReportQueryPayFeeDepositSlice.actions

export const selectReportQueryPayFeeDeposit = (state: RootState) =>
  state.ReportQueryPayFeeDepositSlice

export default ReportQueryPayFeeDepositSlice.reducer
