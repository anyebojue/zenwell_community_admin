import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { UnitParams, UnitReply } from 'api/model/property/unitModel'
import { FindUnit, CreateUnit, UpdateUnit, DeleteUnit } from 'api/property/unit'

const namespace = 'Unit'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: UnitReply[]
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
  async (params: UnitParams & PaginationParams) => {
    const res = await FindUnit(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: UnitParams) => {
  const res = await CreateUnit(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: UnitParams) => {
  const res = await UpdateUnit(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteUnit(ids)
  return res
})

export const UnitSlice = createSlice({
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

export const { reset } = UnitSlice.actions

export const selectUnit = (state: RootState) => state.UnitSlice

export default UnitSlice.reducer
