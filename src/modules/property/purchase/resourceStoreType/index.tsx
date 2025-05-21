import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ResourceStoreTypeParams,
  ResourceStoreTypeReply
} from 'api/model/property/purchase/resourceStoreTypeModel'
import {
  FindResourceStoreType,
  CreateResourceStoreType,
  UpdateResourceStoreType,
  DeleteResourceStoreType
} from 'api/property/purchase/resourceStoreType'

const namespace = 'ResourceStoreType'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ResourceStoreTypeReply[]
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
  async (params: ResourceStoreTypeParams & PaginationParams) => {
    const res = await FindResourceStoreType(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ResourceStoreTypeParams) => {
    const res = await CreateResourceStoreType(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ResourceStoreTypeParams) => {
    const res = await UpdateResourceStoreType(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteResourceStoreType(ids)
  return res
})

export const ResourceStoreTypeSlice = createSlice({
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

export const { reset } = ResourceStoreTypeSlice.actions

export const selectResourceStoreType = (state: RootState) => state.ResourceStoreTypeSlice

export default ResourceStoreTypeSlice.reducer
