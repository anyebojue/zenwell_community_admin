import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { SystemSettingsParams, SystemSettingsReply } from 'api/model/property/systemSettingsModel'
import { FindSystemSettings, UpdateSystemSettings } from 'api/property/systemSettings'

const namespace = 'SystemSettings'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SystemSettingsReply[]
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
  async (params: SystemSettingsParams & PaginationParams) => {
    const res = await FindSystemSettings(params)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: SystemSettingsParams) => {
    const res = await UpdateSystemSettings(data)
    return res
  }
)

export const SystemSettingsSlice = createSlice({
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

export const { reset } = SystemSettingsSlice.actions

export const selectSystemSettings = (state: RootState) => state.SystemSettingsSlice

export default SystemSettingsSlice.reducer
