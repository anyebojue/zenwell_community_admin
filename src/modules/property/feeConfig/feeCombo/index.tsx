import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FeeComboParams, FeeComboReply } from 'api/model/property/feeConfig/feeComboModel'
import {
  FindFeeCombo,
  CreateFeeCombo,
  UpdateFeeCombo,
  DeleteFeeCombo
} from 'api/property/feeConfig/feeCombo'

const namespace = 'FeeCombo'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeComboReply[]
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
  async (params: FeeComboParams & PaginationParams) => {
    const res = await FindFeeCombo(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: FeeComboParams) => {
  const res = await CreateFeeCombo(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: FeeComboParams) => {
  const res = await UpdateFeeCombo(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeCombo(ids)
  return res
})

export const FeeComboSlice = createSlice({
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

export const { reset } = FeeComboSlice.actions

export const selectFeeCombo = (state: RootState) => state.FeeComboSlice

export default FeeComboSlice.reducer
