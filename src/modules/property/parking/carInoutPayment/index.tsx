import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  CarInoutPaymentParams,
  CarInoutPaymentReply
} from 'api/model/property/parking/carInoutPaymentModel'
import {
  FindCarInoutPayment,
  CreateCarInoutPayment,
  UpdateCarInoutPayment,
  DeleteCarInoutPayment
} from 'api/property/parking/carInoutPayment'

const namespace = 'CarInoutPayment'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: CarInoutPaymentReply[]
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
  async (params: CarInoutPaymentParams & PaginationParams) => {
    const res = await FindCarInoutPayment(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: CarInoutPaymentParams) => {
    const res = await CreateCarInoutPayment(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: CarInoutPaymentParams) => {
    const res = await UpdateCarInoutPayment(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteCarInoutPayment(ids)
  return res
})

export const CarInoutPaymentSlice = createSlice({
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

export const { reset } = CarInoutPaymentSlice.actions

export const selectCarInoutPayment = (state: RootState) => state.CarInoutPaymentSlice

export default CarInoutPaymentSlice.reducer
