import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  OwnerInvoiceApplyEventParams,
  OwnerInvoiceApplyEventReply
} from 'api/model/property/houses/ownerInvoiceApplyEventModel'
import {
  FindOwnerInvoiceApplyEvent,
  CreateOwnerInvoiceApplyEvent,
  UpdateOwnerInvoiceApplyEvent,
  DeleteOwnerInvoiceApplyEvent
} from 'api/property/houses/ownerInvoiceApplyEvent'

const nameownerInvoiceApplyEvent = 'OwnerInvoiceApplyEvent'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: OwnerInvoiceApplyEventReply[]
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
  `${nameownerInvoiceApplyEvent}/find`,
  async (params: OwnerInvoiceApplyEventParams & PaginationParams) => {
    const res = await FindOwnerInvoiceApplyEvent(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${nameownerInvoiceApplyEvent}/create`,
  async (data: OwnerInvoiceApplyEventParams) => {
    const res = await CreateOwnerInvoiceApplyEvent(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${nameownerInvoiceApplyEvent}/update`,
  async (data: OwnerInvoiceApplyEventParams) => {
    const res = await UpdateOwnerInvoiceApplyEvent(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(
  `${nameownerInvoiceApplyEvent}/deleteByIds`,
  async (ids: string[]) => {
    const res = await DeleteOwnerInvoiceApplyEvent(ids)
    return res
  }
)

export const OwnerInvoiceApplyEventSlice = createSlice({
  name: nameownerInvoiceApplyEvent,
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

export const { reset } = OwnerInvoiceApplyEventSlice.actions

export const selectOwnerInvoiceApplyEvent = (state: RootState) => state.OwnerInvoiceApplyEventSlice

export default OwnerInvoiceApplyEventSlice.reducer
