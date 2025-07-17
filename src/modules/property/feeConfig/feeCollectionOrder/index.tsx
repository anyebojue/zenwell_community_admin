import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  FeeCollectionOrderParams,
  FeeCollectionOrderReply
} from 'api/model/property/feeConfig/feeCollectionOrderModel'
import {
  FindFeeCollectionOrder,
  CreateFeeCollectionOrder,
  UpdateFeeCollectionOrder,
  DeleteFeeCollectionOrder
} from 'api/property/feeConfig/feeCollectionOrder'

const namespace = 'FeeCollectionOrder'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeCollectionOrderReply[]
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
  async (params: FeeCollectionOrderParams & PaginationParams) => {
    const res = await FindFeeCollectionOrder(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: FeeCollectionOrderParams) => {
    const res = await CreateFeeCollectionOrder(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: FeeCollectionOrderParams) => {
    const res = await UpdateFeeCollectionOrder(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeCollectionOrder(ids)
  return res
})

export const FeeCollectionOrderSlice = createSlice({
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

export const { reset } = FeeCollectionOrderSlice.actions

export const selectFeeCollectionOrder = (state: RootState) => state.FeeCollectionOrderSlice

export default FeeCollectionOrderSlice.reducer
