import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryReportOwnerPayFee } from 'api/property/report/queryReportOwnerPayFee'
import {
  QueryReportOwnerPayFeeReply,
  QueryReportOwnerPayFeeParams
} from 'api/model/property/report/queryReportOwnerPayFeeModel'

const namespace = 'queryReportOwnerPayFee'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryReportOwnerPayFeeReply[]
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
  async (params: QueryReportOwnerPayFeeParams) => {
    const res = await FindQueryReportOwnerPayFee(params)
    return res
  }
)

export const QueryReportOwnerPayFeeSlice = createSlice({
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

export const { reset } = QueryReportOwnerPayFeeSlice.actions

export const selectQueryReportOwnerPayFee = (state: RootState) => state.QueryReportOwnerPayFeeSlice

export default QueryReportOwnerPayFeeSlice.reducer
