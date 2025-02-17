import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { RepairStaffParams, RepairStaffReply } from 'api/model/property/repair/repairStaffModel'
import {
  FindRepairStaff,
  CreateRepairStaff,
  UpdateRepairStaff,
  DeleteRepairStaff
} from 'api/property/repair/repairStaff'

const namespace = 'RepairStaff'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: RepairStaffReply[]
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
  async (params: RepairStaffParams & PaginationParams) => {
    const res = await FindRepairStaff(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: RepairStaffParams) => {
  const res = await CreateRepairStaff(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: RepairStaffParams) => {
  const res = await UpdateRepairStaff(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteRepairStaff(ids)
  return res
})

export const RepairStaffSlice = createSlice({
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

export const { reset } = RepairStaffSlice.actions

export const selectRepairStaff = (state: RootState) => state.RepairStaffSlice

export default RepairStaffSlice.reducer
