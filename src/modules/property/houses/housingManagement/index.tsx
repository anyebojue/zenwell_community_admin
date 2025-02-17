import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  HousingManagementParams,
  HousingManagementReply
} from 'api/model/property/houses/housingManagementModel'
import {
  FindHousingManagement,
  CreateHousingManagement,
  UpdateHousingManagement,
  DeleteHousingManagement
} from 'api/property/houses/housingManagement'

const namespace = 'HousingManagement'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: HousingManagementReply[]
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
  async (params: HousingManagementParams & PaginationParams) => {
    const res = await FindHousingManagement(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: HousingManagementParams) => {
    const res = await CreateHousingManagement(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: HousingManagementParams) => {
    const res = await UpdateHousingManagement(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteHousingManagement(ids)
  return res
})

export const HousingManagementSlice = createSlice({
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

export const { reset } = HousingManagementSlice.actions

export const selectHousingManagement = (state: RootState) => state.HousingManagementSlice

export default HousingManagementSlice.reducer
