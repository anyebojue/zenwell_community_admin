import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  SpectionTaskParams,
  SpectionTaskReply
} from 'api/model/property/inspection/spectionTaskModel'
import {
  FindSpectionTask,
  CreateSpectionTask,
  UpdateSpectionTask,
  DeleteSpectionTask
} from 'api/property/inspection/spectionTask'

const namespace = 'SpectionTask'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpectionTaskReply[]
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
  async (params: SpectionTaskParams & PaginationParams) => {
    const res = await FindSpectionTask(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: SpectionTaskParams) => {
  const res = await CreateSpectionTask(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: SpectionTaskParams) => {
  const res = await UpdateSpectionTask(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpectionTask(ids)
  return res
})

export const SpectionTaskSlice = createSlice({
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

export const { reset } = SpectionTaskSlice.actions

export const selectSpectionTask = (state: RootState) => state.SpectionTaskSlice

export default SpectionTaskSlice.reducer
