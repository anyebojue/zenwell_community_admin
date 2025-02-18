import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { FeeFormulaParams, FeeFormulaReply } from 'api/model/property/feeConfig/feeFormulaModel'
import {
  FindFeeFormula,
  CreateFeeFormula,
  UpdateFeeFormula,
  DeleteFeeFormula
} from 'api/property/feeConfig/feeFormula'

const namespace = 'FeeFormula'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeFormulaReply[]
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
  async (params: FeeFormulaParams & PaginationParams) => {
    const res = await FindFeeFormula(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: FeeFormulaParams) => {
  const res = await CreateFeeFormula(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: FeeFormulaParams) => {
  const res = await UpdateFeeFormula(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeFormula(ids)
  return res
})

export const FeeFormulaSlice = createSlice({
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

export const { reset } = FeeFormulaSlice.actions

export const selectFeeFormula = (state: RootState) => state.FeeFormulaSlice

export default FeeFormulaSlice.reducer
