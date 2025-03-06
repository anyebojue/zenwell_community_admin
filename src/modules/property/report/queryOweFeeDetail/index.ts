import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryOweFeeDetail } from 'api/property/report/queryOweFeeDetail'
import {
  QueryOweFeeDetailReply,
  QueryOweFeeDetailParams
} from 'api/model/property/report/queryOweFeeDetailModel'

const namespace = 'queryOweFeeDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryOweFeeDetailReply[]
  exportUrl: string
  totalPreferentialAmount: string
  allOweAmount: string
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
  totalPreferentialAmount: '',
  allOweAmount: ''
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (
    params: QueryOweFeeDetailParams &
      PaginationParams & {
        isExport?: boolean
        totalPreferentialAmount: string
        allOweAmount: string
      }
  ) => {
    const res = await FindQueryOweFeeDetail(params)
    return res
  }
)

export const QueryOweFeeDetailSlice = createSlice({
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
      state.totalPreferentialAmount = action.payload.totalPreferentialAmount
      state.allOweAmount = action.payload.allOweAmount
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = QueryOweFeeDetailSlice.actions

export const selectQueryOweFeeDetail = (state: RootState) => state.QueryOweFeeDetailSlice

export default QueryOweFeeDetailSlice.reducer
