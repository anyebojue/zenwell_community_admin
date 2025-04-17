import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FloorParams, FloorReply } from 'api/model/property/houses/floorModel'
import { FindFloor, CreateFloor, UpdateFloor, DeleteFloor } from 'api/property/houses/floor'

const namespace = 'Floor'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FloorReply[]
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
  async (params: FloorParams & PaginationParams) => {
    const res = await FindFloor(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: FloorParams) => {
  const res = await CreateFloor(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: FloorParams) => {
  const res = await UpdateFloor(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFloor(ids)
  return res
})

export const FloorSlice = createSlice({
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

export const { reset } = FloorSlice.actions

export const selectFloor = (state: RootState) => state.FloorSlice

export default FloorSlice.reducer
