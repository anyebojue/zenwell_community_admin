import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { SpectionPlanParams, SpectionPlanReply } from 'api/model/property/spectionPlanModel'
import {
  FindSpectionPlan,
  CreateSpectionPlan,
  UpdateSpectionPlan,
  DeleteSpectionPlan
} from 'api/property/inspection/spectionPlan'

const namespace = 'SpectionPlan'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpectionPlanReply[]
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
  async (params: SpectionPlanParams & PaginationParams) => {
    const res = await FindSpectionPlan(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: SpectionPlanParams) => {
  const res = await CreateSpectionPlan(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: SpectionPlanParams) => {
  const res = await UpdateSpectionPlan(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpectionPlan(ids)
  return res
})

export const SpectionPlanSlice = createSlice({
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

export const { reset } = SpectionPlanSlice.actions

export const selectSpectionPlan = (state: RootState) => state.SpectionPlanSlice

export default SpectionPlanSlice.reducer
