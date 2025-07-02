import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ParkingSpaceApplyParams,
  ParkingSpaceApplyReply
} from 'api/model/property/parking/parkingSpaceApplyModel'
import {
  FindParkingSpaceApply,
  CreateParkingSpaceApply,
  UpdateParkingSpaceApply,
  DeleteParkingSpaceApply
} from 'api/property/parking/parkingSpaceApply'

const namespace = 'ParkingSpaceApply'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ParkingSpaceApplyReply[]
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
  async (params: ParkingSpaceApplyParams & PaginationParams) => {
    const res = await FindParkingSpaceApply(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ParkingSpaceApplyParams) => {
    const res = await CreateParkingSpaceApply(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ParkingSpaceApplyParams) => {
    const res = await UpdateParkingSpaceApply(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteParkingSpaceApply(ids)
  return res
})

export const ParkingSpaceApplySlice = createSlice({
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

export const { reset } = ParkingSpaceApplySlice.actions

export const selectParkingSpaceApply = (state: RootState) => state.ParkingSpaceApplySlice

export default ParkingSpaceApplySlice.reducer
