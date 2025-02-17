import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { ReleaseTypeParams, ReleaseTypeReply } from 'api/model/property/communitys/releaseTypeModel'
import {
  FindReleaseType,
  CreateReleaseType,
  UpdateReleaseType,
  DeleteReleaseType
} from 'api/property/communitys/releaseType'

const namespace = 'ReleaseType'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReleaseTypeReply[]
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
  async (params: ReleaseTypeParams & PaginationParams) => {
    const res = await FindReleaseType(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: ReleaseTypeParams) => {
  const res = await CreateReleaseType(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: ReleaseTypeParams) => {
  const res = await UpdateReleaseType(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteReleaseType(ids)
  return res
})

export const ReleaseTypeSlice = createSlice({
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

export const { reset } = ReleaseTypeSlice.actions

export const selectReleaseType = (state: RootState) => state.ReleaseTypeSlice

export default ReleaseTypeSlice.reducer
