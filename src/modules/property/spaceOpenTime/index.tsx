import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { SpaceOpenTimeParams, SpaceOpenTimeReply } from 'api/model/property/spaceOpenTimeModel'
import {
  FindSpaceOpenTime,
  CreateSpaceOpenTime,
  UpdateSpaceOpenTime,
  DeleteSpaceOpenTime
} from 'api/property/spaceOpenTime'

const namespace = 'SpaceOpenTime'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpaceOpenTimeReply[]
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
  async (params: SpaceOpenTimeParams & PaginationParams) => {
    const res = await FindSpaceOpenTime(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: SpaceOpenTimeParams) => {
  const res = await CreateSpaceOpenTime(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: SpaceOpenTimeParams) => {
  const res = await UpdateSpaceOpenTime(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpaceOpenTime(ids)
  return res
})

export const SpaceOpenTimeSlice = createSlice({
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

export const { reset } = SpaceOpenTimeSlice.actions

export const selectSpaceOpenTime = (state: RootState) => state.SpaceOpenTimeSlice

export default SpaceOpenTimeSlice.reducer
