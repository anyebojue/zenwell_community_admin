import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { ReleaseParams, ReleaseReply } from 'api/model/property/communitys/releaseModel'
import {
  FindRelease,
  CreateRelease,
  UpdateRelease,
  DeleteRelease
} from 'api/property/communitys/release'

const namespace = 'Release'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReleaseReply[]
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
  async (params: ReleaseParams & PaginationParams) => {
    const res = await FindRelease(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: ReleaseParams) => {
  const res = await CreateRelease(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: ReleaseParams) => {
  const res = await UpdateRelease(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteRelease(ids)
  return res
})

export const ReleaseSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: builder => {
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

export const { reset } = ReleaseSlice.actions

export const selectRelease = (state: RootState) => state.ReleaseSlice

export default ReleaseSlice.reducer
