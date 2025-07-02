import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { StorehouseParams, StorehouseReply } from 'api/model/property/purchase/storehouseModel'
import {
  FindStorehouse,
  CreateStorehouse,
  UpdateStorehouse,
  DeleteStorehouse
} from 'api/property/purchase/storehouse'

const namespace = 'Storehouse'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: StorehouseReply[]
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
  async (params: StorehouseParams & PaginationParams) => {
    const res = await FindStorehouse(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: StorehouseParams) => {
  const res = await CreateStorehouse(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: StorehouseParams) => {
  const res = await UpdateStorehouse(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteStorehouse(ids)
  return res
})

export const StorehouseSlice = createSlice({
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

export const { reset } = StorehouseSlice.actions

export const selectStorehouse = (state: RootState) => state.StorehouseSlice

export default StorehouseSlice.reducer
