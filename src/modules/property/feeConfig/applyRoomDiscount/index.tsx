import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ApplyRoomDiscountParams,
  ApplyRoomDiscountReply
} from 'api/model/property/feeConfig/applyRoomDiscountModel'
import {
  FindApplyRoomDiscount,
  CreateApplyRoomDiscount,
  UpdateApplyRoomDiscount,
  DeleteApplyRoomDiscount
} from 'api/property/feeConfig/applyRoomDiscount'

const namespace = 'ApplyRoomDiscount'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ApplyRoomDiscountReply[]
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
  async (params: ApplyRoomDiscountParams & PaginationParams & { is_export?: boolean }) => {
    const res = await FindApplyRoomDiscount(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ApplyRoomDiscountParams) => {
    const res = await CreateApplyRoomDiscount(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ApplyRoomDiscountParams) => {
    const res = await UpdateApplyRoomDiscount(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteApplyRoomDiscount(ids)
  return res
})

export const ApplyRoomDiscountSlice = createSlice({
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
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = ApplyRoomDiscountSlice.actions

export const selectApplyRoomDiscount = (state: RootState) => state.ApplyRoomDiscountSlice

export default ApplyRoomDiscountSlice.reducer
