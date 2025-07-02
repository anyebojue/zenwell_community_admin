import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ChargeMonthCardParams,
  ChargeMonthCardReply
} from 'api/model/property/parking/chargeMonthCardModel'
import {
  FindChargeMonthCard,
  CreateChargeMonthCard,
  UpdateChargeMonthCard,
  DeleteChargeMonthCard
} from 'api/property/parking/chargeMonthCard'

const namespace = 'ChargeMonthCard'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ChargeMonthCardReply[]
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
  async (params: ChargeMonthCardParams & PaginationParams) => {
    const res = await FindChargeMonthCard(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ChargeMonthCardParams) => {
    const res = await CreateChargeMonthCard(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ChargeMonthCardParams) => {
    const res = await UpdateChargeMonthCard(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteChargeMonthCard(ids)
  return res
})

export const ChargeMonthCardSlice = createSlice({
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

export const { reset } = ChargeMonthCardSlice.actions

export const selectChargeMonthCard = (state: RootState) => state.ChargeMonthCardSlice

export default ChargeMonthCardSlice.reducer
