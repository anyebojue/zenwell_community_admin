import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  RoomRenovationDetailParams,
  RoomRenovationDetailReply
} from 'api/model/property/communitys/roomRenovationDetailModel'
import {
  FindRoomRenovationDetail,
  CreateRoomRenovationDetail,
  UpdateRoomRenovationDetail,
  DeleteRoomRenovationDetail
} from 'api/property/communitys/roomRenovationDetail'

const namespace = 'RoomRenovationDetail'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: RoomRenovationDetailReply[]
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
  async (params: RoomRenovationDetailParams & PaginationParams) => {
    const res = await FindRoomRenovationDetail(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: RoomRenovationDetailParams) => {
    const res = await CreateRoomRenovationDetail(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: RoomRenovationDetailParams) => {
    const res = await UpdateRoomRenovationDetail(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteRoomRenovationDetail(ids)
  return res
})

export const RoomRenovationDetailSlice = createSlice({
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

export const { reset } = RoomRenovationDetailSlice.actions

export const selectRoomRenovationDetail = (state: RootState) => state.RoomRenovationDetailSlice

export default RoomRenovationDetailSlice.reducer
