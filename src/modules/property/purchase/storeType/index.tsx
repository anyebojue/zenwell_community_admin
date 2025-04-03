import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { StoreTypeParams, StoreTypeReply } from 'api/model/property/purchase/storeTypeModel'
import {
  FindStoreType,
  CreateStoreType,
  UpdateStoreType,
  DeleteStoreType
} from 'api/property/purchase/storeType'

const namespace = 'StoreType'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: StoreTypeReply[]
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
  async (params: StoreTypeParams & PaginationParams) => {
    const res = await FindStoreType(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: StoreTypeParams) => {
  const res = await CreateStoreType(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: StoreTypeParams) => {
  const res = await UpdateStoreType(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteStoreType(ids)
  return res
})

export const StoreTypeSlice = createSlice({
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

export const { reset } = StoreTypeSlice.actions

export const selectStoreType = (state: RootState) => state.StoreTypeSlice

export default StoreTypeSlice.reducer
