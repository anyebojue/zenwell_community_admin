import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  RoomRenovationParams,
  RoomRenovationReply
} from 'api/model/property/communitys/roomRenovationModel'
import {
  FindRoomRenovation,
  CreateRoomRenovation,
  UpdateRoomRenovation,
  DeleteRoomRenovation
} from 'api/property/communitys/roomRenovation'

const nameroomRenovation = 'RoomRenovation'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: RoomRenovationReply[]
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
  `${nameroomRenovation}/find`,
  async (params: RoomRenovationParams & PaginationParams) => {
    const res = await FindRoomRenovation(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${nameroomRenovation}/create`,
  async (data: RoomRenovationParams) => {
    const res = await CreateRoomRenovation(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${nameroomRenovation}/update`,
  async (data: RoomRenovationParams) => {
    const res = await UpdateRoomRenovation(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(
  `${nameroomRenovation}/deleteByIds`,
  async (ids: string[]) => {
    const res = await DeleteRoomRenovation(ids)
    return res
  }
)

export const RoomRenovationSlice = createSlice({
  name: nameroomRenovation,
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

export const { reset } = RoomRenovationSlice.actions

export const selectRoomRenovation = (state: RootState) => state.RoomRenovationSlice

export default RoomRenovationSlice.reducer
