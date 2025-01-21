import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { StaffParams, StaffReply } from 'api/model/property/staffModel'
import { FindStaff, CreateStaff, UpdateStaff, DeleteStaff } from 'api/property/staff'

const namespace = 'Staff'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: StaffReply[]
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
  async (params: StaffParams & PaginationParams) => {
    const res = await FindStaff(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: StaffParams) => {
  const res = await CreateStaff(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: StaffParams) => {
  const res = await UpdateStaff(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteStaff(ids)
  return res
})

export const StaffSlice = createSlice({
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

export const { reset } = StaffSlice.actions

export const selectStaff = (state: RootState) => state.StaffSlice

export default StaffSlice.reducer
