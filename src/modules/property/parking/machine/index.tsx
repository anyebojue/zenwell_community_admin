import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { MachineParams, MachineReply } from 'api/model/property/parking/machineModel'
import {
  FindMachine,
  CreateMachine,
  UpdateMachine,
  DeleteMachine
} from 'api/property/parking/machine'

const namespace = 'Machine'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: MachineReply[]
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
  async (params: MachineParams & PaginationParams) => {
    const res = await FindMachine(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: MachineParams) => {
  const res = await CreateMachine(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: MachineParams) => {
  const res = await UpdateMachine(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteMachine(ids)
  return res
})

export const MachineSlice = createSlice({
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

export const { reset } = MachineSlice.actions

export const selectMachine = (state: RootState) => state.MachineSlice

export default MachineSlice.reducer
