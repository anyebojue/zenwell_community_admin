import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ApplyRoomDiscountRecordParams,
  ApplyRoomDiscountRecordReply
} from 'api/model/property/feeConfig/applyRoomDiscountRecordModel'
import {
  FindApplyRoomDiscountRecord,
  CreateApplyRoomDiscountRecord,
  UpdateApplyRoomDiscountRecord,
  DeleteApplyRoomDiscountRecord
} from 'api/property/feeConfig/applyRoomDiscountRecord'

const namespace = 'ApplyRoomDiscountRecord'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ApplyRoomDiscountRecordReply[]
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
  async (params: ApplyRoomDiscountRecordParams & PaginationParams) => {
    const res = await FindApplyRoomDiscountRecord(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ApplyRoomDiscountRecordParams) => {
    const res = await CreateApplyRoomDiscountRecord(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ApplyRoomDiscountRecordParams) => {
    const res = await UpdateApplyRoomDiscountRecord(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteApplyRoomDiscountRecord(ids)
  return res
})

export const ApplyRoomDiscountRecordSlice = createSlice({
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
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = ApplyRoomDiscountRecordSlice.actions

export const selectApplyRoomDiscountRecord = (state: RootState) =>
  state.ApplyRoomDiscountRecordSlice

export default ApplyRoomDiscountRecordSlice.reducer
