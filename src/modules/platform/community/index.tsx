import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { CommunityParams, CommunityReply } from 'api/model/platform/communityModel'
import {
  FindCommunity,
  CreateCommunity,
  UpdateCommunity,
  DeleteCommunity
} from 'api/platform/community'

const namespace = 'Community'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: CommunityReply[]
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
  async (params: CommunityParams & PaginationParams) => {
    const res = await FindCommunity(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: CommunityParams) => {
  const res = await CreateCommunity(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: CommunityParams) => {
  const res = await UpdateCommunity(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteCommunity(ids)
  return res
})

export const CommunitySlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(find.fulfilled, (state, action) => {
      state.page = action.payload.page
      state.list = action.payload.list
    })
  }
})

export const { reset } = CommunitySlice.actions

export const selectCommunity = (state: RootState) => state.CommunitySlice

export default CommunitySlice.reducer
