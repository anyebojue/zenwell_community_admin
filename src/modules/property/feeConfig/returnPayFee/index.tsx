import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ReturnPayFeeParams,
  ReturnPayFeeReply,
  FindReturnPayFeeReply
} from 'api/model/property/feeConfig/returnPayFeeModel'
import {
  FindReturnPayFee,
  CreateReturnPayFee,
  UpdateReturnPayFee,
  DeleteReturnPayFee
} from 'api/property/feeConfig/returnPayFee'
import { PayloadAction } from '@reduxjs/toolkit'

const namespace = 'ReturnPayFee'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ReturnPayFeeReply[]
  exportUrl: string
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  exportUrl: ''
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: ReturnPayFeeParams & PaginationParams & { is_export?: boolean }) => {
    const res = await FindReturnPayFee(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: ReturnPayFeeParams) => {
  const res = await CreateReturnPayFee(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: ReturnPayFeeParams) => {
  const res = await UpdateReturnPayFee(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteReturnPayFee(ids)
  return res
})

export const ReturnPayFeeSlice = createSlice({
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
    builder.addCase(find.fulfilled, (state, action: PayloadAction<FindReturnPayFeeReply>) => {
      state.page = action.payload.page
      state.list = action.payload.list
      state.exportUrl = action.payload.exportUrl
    })
    // 请求失败后的数据
    builder.addCase(find.rejected, state => {
      state.list = []
    })
  }
})

export const { reset } = ReturnPayFeeSlice.actions

export const selectReturnPayFee = (state: RootState) => state.ReturnPayFeeSlice

export default ReturnPayFeeSlice.reducer
