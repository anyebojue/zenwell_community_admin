import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ApplyRoomDiscountTypeParams,
  ApplyRoomDiscountTypeReply
} from 'api/model/property/feeConfig/applyRoomDiscountTypeModel'
import {
  FindApplyRoomDiscountType,
  CreateApplyRoomDiscountType,
  UpdateApplyRoomDiscountType,
  DeleteApplyRoomDiscountType
} from 'api/property/feeConfig/applyRoomDiscountType'

const namespace = 'ApplyRoomDiscountType'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ApplyRoomDiscountTypeReply[]
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
  async (params: ApplyRoomDiscountTypeParams & PaginationParams) => {
    const res = await FindApplyRoomDiscountType(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ApplyRoomDiscountTypeParams) => {
    const res = await CreateApplyRoomDiscountType(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ApplyRoomDiscountTypeParams) => {
    const res = await UpdateApplyRoomDiscountType(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteApplyRoomDiscountType(ids)
  return res
})

export const ApplyRoomDiscountTypeSlice = createSlice({
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

export const { reset } = ApplyRoomDiscountTypeSlice.actions

export const selectApplyRoomDiscountType = (state: RootState) => state.ApplyRoomDiscountTypeSlice

export default ApplyRoomDiscountTypeSlice.reducer
