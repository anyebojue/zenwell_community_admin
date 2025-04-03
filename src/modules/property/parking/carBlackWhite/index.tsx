import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  CarBlackWhiteParams,
  CarBlackWhiteReply
} from 'api/model/property/parking/carBlackWhiteModel'
import {
  FindCarBlackWhite,
  CreateCarBlackWhite,
  UpdateCarBlackWhite,
  DeleteCarBlackWhite
} from 'api/property/parking/carBlackWhite'

const namespace = 'CarBlackWhite'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: CarBlackWhiteReply[]
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
  async (params: CarBlackWhiteParams & PaginationParams) => {
    const res = await FindCarBlackWhite(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: CarBlackWhiteParams) => {
  const res = await CreateCarBlackWhite(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: CarBlackWhiteParams) => {
  const res = await UpdateCarBlackWhite(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteCarBlackWhite(ids)
  return res
})

export const CarBlackWhiteSlice = createSlice({
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

export const { reset } = CarBlackWhiteSlice.actions

export const selectCarBlackWhite = (state: RootState) => state.CarBlackWhiteSlice

export default CarBlackWhiteSlice.reducer
