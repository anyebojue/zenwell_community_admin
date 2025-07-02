import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  CommunityAnnouncementParams,
  CommunityAnnouncementReply
} from 'api/model/property/communitys/communityAnnouncementModel'
import {
  FindCommunityAnnouncement,
  CreateCommunityAnnouncement,
  UpdateCommunityAnnouncement,
  DeleteCommunityAnnouncement
} from 'api/property/communitys/communityAnnouncement'

const namespace = 'CommunityAnnouncement'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: CommunityAnnouncementReply[]
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
  async (params: CommunityAnnouncementParams & PaginationParams) => {
    const res = await FindCommunityAnnouncement(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: CommunityAnnouncementParams) => {
    const res = await CreateCommunityAnnouncement(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: CommunityAnnouncementParams) => {
    const res = await UpdateCommunityAnnouncement(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteCommunityAnnouncement(ids)
  return res
})

export const CommunityAnnouncementSlice = createSlice({
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

export const { reset } = CommunityAnnouncementSlice.actions

export const selectCommunityAnnouncement = (state: RootState) => state.CommunityAnnouncementSlice

export default CommunityAnnouncementSlice.reducer
