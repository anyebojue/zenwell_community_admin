import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ResourceSupplierParams,
  ResourceSupplierReply
} from 'api/model/property/purchase/resourceSupplierModel'
import {
  FindResourceSupplier,
  CreateResourceSupplier,
  UpdateResourceSupplier,
  DeleteResourceSupplier
} from 'api/property/purchase/resourceSupplier'

const namespace = 'ResourceSupplier'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ResourceSupplierReply[]
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
  async (params: ResourceSupplierParams & PaginationParams) => {
    const res = await FindResourceSupplier(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ResourceSupplierParams) => {
    const res = await CreateResourceSupplier(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ResourceSupplierParams) => {
    const res = await UpdateResourceSupplier(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteResourceSupplier(ids)
  return res
})

export const ResourceSupplierSlice = createSlice({
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

export const { reset } = ResourceSupplierSlice.actions

export const selectResourceSupplier = (state: RootState) => state.ResourceSupplierSlice

export default ResourceSupplierSlice.reducer
