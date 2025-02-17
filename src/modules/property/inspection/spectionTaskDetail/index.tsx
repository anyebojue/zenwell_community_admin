import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  SpectionTaskDetailParams,
  SpectionTaskDetailReply
} from 'api/model/property/spectionTaskDetailModel'
import {
  FindSpectionTaskDetail,
  CreateSpectionTaskDetail,
  UpdateSpectionTaskDetail,
  DeleteSpectionTaskDetail
} from 'api/property/inspection/spectionTaskDetail'

const namespace = 'SpectionTaskDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpectionTaskDetailReply[]
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
  async (params: SpectionTaskDetailParams & PaginationParams) => {
    const res = await FindSpectionTaskDetail(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: SpectionTaskDetailParams) => {
    const res = await CreateSpectionTaskDetail(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: SpectionTaskDetailParams) => {
    const res = await UpdateSpectionTaskDetail(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpectionTaskDetail(ids)
  return res
})

export const SpectionTaskDetailSlice = createSlice({
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

export const { reset } = SpectionTaskDetailSlice.actions

export const selectSpectionTaskDetail = (state: RootState) => state.SpectionTaskDetailSlice

export default SpectionTaskDetailSlice.reducer
