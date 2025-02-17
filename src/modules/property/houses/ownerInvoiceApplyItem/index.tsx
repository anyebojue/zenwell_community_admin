import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  OwnerInvoiceApplyItemParams,
  OwnerInvoiceApplyItemReply
} from 'api/model/property/ownerInvoiceApplyItemModel'
import {
  FindOwnerInvoiceApplyItem,
  CreateOwnerInvoiceApplyItem,
  UpdateOwnerInvoiceApplyItem,
  DeleteOwnerInvoiceApplyItem
} from 'api/property/houses/ownerInvoiceApplyItem'

const namespace = 'OwnerInvoiceApplyItem'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: OwnerInvoiceApplyItemReply[]
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
  async (params: OwnerInvoiceApplyItemParams & PaginationParams) => {
    const res = await FindOwnerInvoiceApplyItem(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: OwnerInvoiceApplyItemParams) => {
    const res = await CreateOwnerInvoiceApplyItem(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: OwnerInvoiceApplyItemParams) => {
    const res = await UpdateOwnerInvoiceApplyItem(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteOwnerInvoiceApplyItem(ids)
  return res
})

export const OwnerInvoiceApplyItemSlice = createSlice({
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

export const { reset } = OwnerInvoiceApplyItemSlice.actions

export const selectOwnerInvoiceApplyItem = (state: RootState) => state.OwnerInvoiceApplyItemSlice

export default OwnerInvoiceApplyItemSlice.reducer
