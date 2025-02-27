import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { ImportFeeParams, ImportFeeReply } from 'api/model/property/feeConfig/importFeeModel'
import {
  FindImportFee,
  CreateImportFee,
  UpdateImportFee,
  DeleteImportFee
} from 'api/property/feeConfig/importFee'

const namespace = 'ImportFee'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ImportFeeReply[]
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
  async (params: ImportFeeParams & PaginationParams) => {
    const res = await FindImportFee(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: ImportFeeParams) => {
  const res = await CreateImportFee(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: ImportFeeParams) => {
  const res = await UpdateImportFee(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteImportFee(ids)
  return res
})

export const ImportFeeSlice = createSlice({
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

export const { reset } = ImportFeeSlice.actions

export const selectImportFee = (state: RootState) => state.ImportFeeSlice

export default ImportFeeSlice.reducer
