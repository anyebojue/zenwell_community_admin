import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { SpectionParams, SpectionReply } from 'api/model/property/spectionModel'
import {
  FindSpection,
  CreateSpection,
  UpdateSpection,
  DeleteSpection
} from 'api/property/inspection/spection'

const namespace = 'Spection'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpectionReply[]
  spection: SpectionReply
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  spection: {}
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: SpectionParams & PaginationParams) => {
    const res = await FindSpection(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: SpectionParams) => {
  const res = await CreateSpection(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: SpectionParams) => {
  const res = await UpdateSpection(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpection(ids)
  return res
})

export const SpectionSlice = createSlice({
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

export const { reset } = SpectionSlice.actions

export const selectSpection = (state: RootState) => state.SpectionSlice

export default SpectionSlice.reducer
