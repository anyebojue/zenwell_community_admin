import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { OwnerInvoiceParams, OwnerInvoiceReply } from 'api/model/property/ownerInvoiceModel'
import {
  FindOwnerInvoice,
  CreateOwnerInvoice,
  UpdateOwnerInvoice,
  DeleteOwnerInvoice
} from 'api/property/ownerInvoiceModel'

const namespace = 'OwnerInvoice'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: OwnerInvoiceReply[]
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
  async (params: OwnerInvoiceParams & PaginationParams) => {
    const res = await FindOwnerInvoice(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: OwnerInvoiceParams) => {
  const res = await CreateOwnerInvoice(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: OwnerInvoiceParams) => {
  const res = await UpdateOwnerInvoice(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteOwnerInvoice(ids)
  return res
})

export const OwnerInvoiceSlice = createSlice({
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

export const { reset } = OwnerInvoiceSlice.actions

export const selectOwnerInvoice = (state: RootState) => state.OwnerInvoiceSlice

export default OwnerInvoiceSlice.reducer
