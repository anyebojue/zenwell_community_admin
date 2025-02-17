import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  RoomRenovationRecordParams,
  RoomRenovationRecordReply
} from 'api/model/property/communitys/roomRenovationRecordModel'
import {
  FindRoomRenovationRecord,
  CreateRoomRenovationRecord,
  UpdateRoomRenovationRecord,
  DeleteRoomRenovationRecord
} from 'api/property/communitys/roomRenovationRecord'

const namespace = 'RoomRenovationRecord'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: RoomRenovationRecordReply[]
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
  async (params: RoomRenovationRecordParams & PaginationParams) => {
    const res = await FindRoomRenovationRecord(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: RoomRenovationRecordParams) => {
    const res = await CreateRoomRenovationRecord(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: RoomRenovationRecordParams) => {
    const res = await UpdateRoomRenovationRecord(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteRoomRenovationRecord(ids)
  return res
})

export const RoomRenovationRecordSlice = createSlice({
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

export const { reset } = RoomRenovationRecordSlice.actions

export const selectRoomRenovationRecord = (state: RootState) => state.RoomRenovationRecordSlice

export default RoomRenovationRecordSlice.reducer
