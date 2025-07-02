import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ResourceStoreParams,
  ResourceStoreReply
} from 'api/model/property/purchase/resourceStoreModel'
import {
  FindResourceStore,
  CreateResourceStore,
  UpdateResourceStore,
  DeleteResourceStore
} from 'api/property/purchase/resourceStore'

const namespace = 'ResourceStore'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ResourceStoreReply[]
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
  async (params: ResourceStoreParams & PaginationParams) => {
    const res = await FindResourceStore(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: ResourceStoreParams) => {
  const res = await CreateResourceStore(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: ResourceStoreParams) => {
  const res = await UpdateResourceStore(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteResourceStore(ids)
  return res
})

export const ResourceStoreSlice = createSlice({
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

export const { reset } = ResourceStoreSlice.actions

export const selectResourceStore = (state: RootState) => state.ResourceStoreSlice

export default ResourceStoreSlice.reducer
