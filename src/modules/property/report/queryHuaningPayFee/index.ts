import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FindQueryHuaningPayFee } from 'api/property/report/queryHuaningPayFee'
import {
  QueryHuaningPayFeeReply,
  QueryHuaningPayFeeParams
} from 'api/model/property/report/queryHuaningPayFeeModel'

const namespace = 'queryHuaningPayFee'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: QueryHuaningPayFeeReply[]
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
  async (params: QueryHuaningPayFeeParams & PaginationParams) => {
    const res = await FindQueryHuaningPayFee(params)
    return res
  }
)

export const QueryHuaningPayFeeSlice = createSlice({
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

export const { reset } = QueryHuaningPayFeeSlice.actions

export const selectQueryHuaningPayFee = (state: RootState) => state.QueryHuaningPayFeeSlice

export default QueryHuaningPayFeeSlice.reducer
