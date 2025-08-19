import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  AllocationStorehouseApplyParams,
  AllocationStorehouseApplyReply
} from 'api/model/property/purchase/allocationStorehouseApplyModel'
import {
  FindAllocationStorehouseApply,
  CreateAllocationStorehouseApply,
  UpdateAllocationStorehouseApply,
  DeleteAllocationStorehouseApply
} from 'api/property/purchase/allocationStorehouseApply'

const namespace = 'AllocationStorehouseApply'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: AllocationStorehouseApplyReply[]
  exportUrl: string
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  exportUrl: ''
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: AllocationStorehouseApplyParams & PaginationParams) => {
    const res = await FindAllocationStorehouseApply(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: AllocationStorehouseApplyParams) => {
    const res = await CreateAllocationStorehouseApply(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: AllocationStorehouseApplyParams) => {
    const res = await UpdateAllocationStorehouseApply(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteAllocationStorehouseApply(ids)
  return res
})

export const AllocationStorehouseApplySlice = createSlice({
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
      state.exportUrl = action.payload.exportUrl
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = AllocationStorehouseApplySlice.actions

export const selectAllocationStorehouseApply = (state: RootState) =>
  state.AllocationStorehouseApplySlice

export default AllocationStorehouseApplySlice.reducer
