import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ResourceStoreSpecificationParams,
  ResourceStoreSpecificationReply
} from 'api/model/property/purchase/resourceStoreSpecificationModel'
import {
  FindResourceStoreSpecification,
  CreateResourceStoreSpecification,
  UpdateResourceStoreSpecification,
  DeleteResourceStoreSpecification
} from 'api/property/purchase/resourceStoreSpecification'

const namespace = 'ResourceStoreSpecification'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ResourceStoreSpecificationReply[]
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
  async (params: ResourceStoreSpecificationParams & PaginationParams) => {
    const res = await FindResourceStoreSpecification(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ResourceStoreSpecificationParams) => {
    const res = await CreateResourceStoreSpecification(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ResourceStoreSpecificationParams) => {
    const res = await UpdateResourceStoreSpecification(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteResourceStoreSpecification(ids)
  return res
})

export const ResourceStoreSpecificationSlice = createSlice({
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

export const { reset } = ResourceStoreSpecificationSlice.actions

export const selectResourceStoreSpecification = (state: RootState) =>
  state.ResourceStoreSpecificationSlice

export default ResourceStoreSpecificationSlice.reducer
