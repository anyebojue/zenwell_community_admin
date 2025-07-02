import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { RoomParams, RoomReply } from 'api/model/property/houses/roomModel'
import { FindRoom, CreateRoom, UpdateRoom, DeleteRoom } from 'api/property/houses/room'

const namespace = 'Room'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: RoomReply[]
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
  async (params: RoomParams & PaginationParams) => {
    const res = await FindRoom(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: RoomParams) => {
  const res = await CreateRoom(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: RoomParams) => {
  const res = await UpdateRoom(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteRoom(ids)
  return res
})

export const RoomSlice = createSlice({
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

export const { reset } = RoomSlice.actions

export const selectRoom = (state: RootState) => state.RoomSlice

export default RoomSlice.reducer
