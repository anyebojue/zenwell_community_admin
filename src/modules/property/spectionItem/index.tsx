import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { SpectionItemParams, SpectionItemReply } from 'api/model/property/spectionItemModel'
import {
  FindSpectionItem,
  CreateSpectionItem,
  UpdateSpectionItem,
  DeleteSpectionItem
} from 'api/property/spectionItem'

const namespace = 'SpectionItem'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpectionItemReply[]
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
  async (params: SpectionItemParams & PaginationParams) => {
    const res = await FindSpectionItem(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: SpectionItemParams) => {
  const res = await CreateSpectionItem(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: SpectionItemParams) => {
  const res = await UpdateSpectionItem(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpectionItem(ids)
  return res
})

export const SpectionItemSlice = createSlice({
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

export const { reset } = SpectionItemSlice.actions

export const selectSpectionItem = (state: RootState) => state.SpectionItemSlice

export default SpectionItemSlice.reducer
