import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  RepairPoolParams,
  RepairPoolReply,
  RepairReturnVisitParams
} from 'api/model/property/repairPoolModel'
import {
  FindRepairPool,
  CreateRepairPool,
  UpdateRepairPool,
  DeleteRepairPool,
  GetRepairPool,
  CreateRepairReturnVisit
} from 'api/property/repair/repairPool'

const namespace = 'RepairPool'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: RepairPoolReply[]
  repairPool: RepairPoolReply
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  repairPool: {}
}

export const createRepairReturnVisit = createAsyncThunk(
  `${namespace}/create`,
  async (data: RepairReturnVisitParams) => {
    const res = await CreateRepairReturnVisit(data)
    return res
  }
)

export const get = createAsyncThunk(`${namespace}/get`, async (params: { id: string }) => {
  const res = await GetRepairPool(params)
  return res
})

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: RepairPoolParams & PaginationParams) => {
    const res = await FindRepairPool(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: RepairPoolParams) => {
  const res = await CreateRepairPool(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: RepairPoolParams) => {
  const res = await UpdateRepairPool(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteRepairPool(ids)
  return res
})

export const RepairPoolSlice = createSlice({
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
    builder.addCase(get.fulfilled, (state, action) => {
      state.repairPool = action.payload
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = RepairPoolSlice.actions

export const selectRepairPool = (state: RootState) => state.RepairPoolSlice

export default RepairPoolSlice.reducer
