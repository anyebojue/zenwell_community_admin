import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { SpectionRouteParams, SpectionRouteReply } from 'api/model/property/spectionRouteModel'
import {
  FindSpectionRoute,
  CreateSpectionRoute,
  UpdateSpectionRoute,
  DeleteSpectionRoute
} from 'api/property/inspection/spectionRoute'

const namespace = 'SpectionRoute'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpectionRouteReply[]
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
  async (params: SpectionRouteParams & PaginationParams) => {
    const res = await FindSpectionRoute(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: SpectionRouteParams) => {
  const res = await CreateSpectionRoute(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: SpectionRouteParams) => {
  const res = await UpdateSpectionRoute(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpectionRoute(ids)
  return res
})

export const SpectionRouteSlice = createSlice({
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

export const { reset } = SpectionRouteSlice.actions

export const selectSpectionRoute = (state: RootState) => state.SpectionRouteSlice

export default SpectionRouteSlice.reducer
