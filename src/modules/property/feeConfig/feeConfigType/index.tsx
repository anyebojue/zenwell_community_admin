import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  FeeConfigTypeParams,
  FeeConfigTypeReply
} from 'api/model/property/feeConfig/feeConfigTypeModel'
import {
  FindFeeConfigType,
  CreateFeeConfigType,
  UpdateFeeConfigType,
  DeleteFeeConfigType
} from 'api/property/feeConfig/feeConfigType'

const namespace = 'FeeConfigType'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeConfigTypeReply[]
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
  async (params: FeeConfigTypeParams & PaginationParams) => {
    const res = await FindFeeConfigType(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: FeeConfigTypeParams) => {
  const res = await CreateFeeConfigType(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: FeeConfigTypeParams) => {
  const res = await UpdateFeeConfigType(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeConfigType(ids)
  return res
})

export const FeeConfigTypeSlice = createSlice({
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

export const { reset } = FeeConfigTypeSlice.actions

export const selectFeeConfigType = (state: RootState) => state.FeeConfigTypeSlice

export default FeeConfigTypeSlice.reducer
