import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { RepairSettingParams, RepairSettingReply } from 'api/model/property/repairSettingModel'
import {
  FindRepairSetting,
  CreateRepairSetting,
  UpdateRepairSetting,
  DeleteRepairSetting
} from 'api/property/repair/repairSetting'

const namespace = 'RepairSetting'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: RepairSettingReply[]
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
  async (params: RepairSettingParams & PaginationParams) => {
    const res = await FindRepairSetting(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: RepairSettingParams) => {
  const res = await CreateRepairSetting(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: RepairSettingParams) => {
  const res = await UpdateRepairSetting(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteRepairSetting(ids)
  return res
})

export const RepairSettingSlice = createSlice({
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

export const { reset } = RepairSettingSlice.actions

export const selectRepairSetting = (state: RootState) => state.RepairSettingSlice

export default RepairSettingSlice.reducer
