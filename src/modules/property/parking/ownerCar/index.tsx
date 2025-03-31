import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { OwnerCarParams, OwnerCarReply } from 'api/model/property/parking/ownerCarModel'
import {
  FindOwnerCar,
  CreateOwnerCar,
  UpdateOwnerCar,
  DeleteOwnerCar
} from 'api/property/parking/ownerCar'

const namespace = 'OwnerCar'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: OwnerCarReply[]
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
  async (params: OwnerCarParams & PaginationParams) => {
    const res = await FindOwnerCar(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: OwnerCarParams) => {
  const res = await CreateOwnerCar(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: OwnerCarParams) => {
  const res = await UpdateOwnerCar(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteOwnerCar(ids)
  return res
})

export const OwnerCarSlice = createSlice({
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
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = OwnerCarSlice.actions

export const selectOwnerCar = (state: RootState) => state.OwnerCarSlice

export default OwnerCarSlice.reducer
