import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  FeeCollectionDetailParams,
  FeeCollectionDetailReply
} from 'api/model/property/feeConfig/feeCollectionDetailModel'
import {
  FindFeeCollectionDetail,
  CreateFeeCollectionDetail,
  UpdateFeeCollectionDetail,
  DeleteFeeCollectionDetail
} from 'api/property/feeConfig/feeCollectionDetail'

const namespace = 'FeeCollectionDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeCollectionDetailReply[]
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
  async (params: FeeCollectionDetailParams & PaginationParams) => {
    const res = await FindFeeCollectionDetail(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: FeeCollectionDetailParams) => {
    const res = await CreateFeeCollectionDetail(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: FeeCollectionDetailParams) => {
    const res = await UpdateFeeCollectionDetail(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeCollectionDetail(ids)
  return res
})

export const FeeCollectionDetailSlice = createSlice({
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

export const { reset } = FeeCollectionDetailSlice.actions

export const selectFeeCollectionDetail = (state: RootState) => state.FeeCollectionDetailSlice

export default FeeCollectionDetailSlice.reducer
