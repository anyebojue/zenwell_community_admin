import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  OwnerInvoiceApplyParams,
  OwnerInvoiceApplyReply
} from 'api/model/property/ownerInvoiceApplyModel'
import {
  FindOwnerInvoiceApply,
  CreateOwnerInvoiceApply,
  UpdateOwnerInvoiceApply,
  DeleteOwnerInvoiceApply
} from 'api/property/ownerInvoiceApply'

const namespace = 'OwnerInvoiceApply'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: OwnerInvoiceApplyReply[]
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
  async (params: OwnerInvoiceApplyParams & PaginationParams) => {
    const res = await FindOwnerInvoiceApply(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: OwnerInvoiceApplyParams) => {
    const res = await CreateOwnerInvoiceApply(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: OwnerInvoiceApplyParams) => {
    const res = await UpdateOwnerInvoiceApply(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteOwnerInvoiceApply(ids)
  return res
})

export const OwnerInvoiceApplySlice = createSlice({
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

export const { reset } = OwnerInvoiceApplySlice.actions

export const selectOwnerInvoiceApply = (state: RootState) => state.OwnerInvoiceApplySlice

export default OwnerInvoiceApplySlice.reducer
