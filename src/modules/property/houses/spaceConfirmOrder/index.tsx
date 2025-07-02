import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  SpaceConfirmOrderParams,
  SpaceConfirmOrderReply
} from 'api/model/property/houses/spaceConfirmOrderModel'
import {
  FindSpaceConfirmOrder,
  CreateSpaceConfirmOrder,
  UpdateSpaceConfirmOrder,
  DeleteSpaceConfirmOrder
} from 'api/property/houses/spaceConfirmOrder'

const namespace = 'SpaceConfirmOrder'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpaceConfirmOrderReply[]
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
  async (params: SpaceConfirmOrderParams & PaginationParams) => {
    const res = await FindSpaceConfirmOrder(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: SpaceConfirmOrderParams) => {
    const res = await CreateSpaceConfirmOrder(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: SpaceConfirmOrderParams) => {
    const res = await UpdateSpaceConfirmOrder(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpaceConfirmOrder(ids)
  return res
})

export const SpaceConfirmOrderSlice = createSlice({
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

export const { reset } = SpaceConfirmOrderSlice.actions

export const selectSpaceConfirmOrder = (state: RootState) => state.SpaceConfirmOrderSlice

export default SpaceConfirmOrderSlice.reducer
