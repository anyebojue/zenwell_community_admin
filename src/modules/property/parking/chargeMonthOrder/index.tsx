import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ChargeMonthOrderParams,
  ChargeMonthOrderReply
} from 'api/model/property/parking/chargeMonthOrderModel'
import {
  FindChargeMonthOrder,
  CreateChargeMonthOrder,
  UpdateChargeMonthOrder,
  DeleteChargeMonthOrder
} from 'api/property/parking/chargeMonthOrder'

const namespace = 'ChargeMonthOrder'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ChargeMonthOrderReply[]
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
  async (params: ChargeMonthOrderParams & PaginationParams) => {
    const res = await FindChargeMonthOrder(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ChargeMonthOrderParams) => {
    const res = await CreateChargeMonthOrder(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ChargeMonthOrderParams) => {
    const res = await UpdateChargeMonthOrder(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteChargeMonthOrder(ids)
  return res
})

export const ChargeMonthOrderSlice = createSlice({
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

export const { reset } = ChargeMonthOrderSlice.actions

export const selectChargeMonthOrder = (state: RootState) => state.ChargeMonthOrderSlice

export default ChargeMonthOrderSlice.reducer
