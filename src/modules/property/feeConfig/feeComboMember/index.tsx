import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  FeeComboMemberParams,
  FeeComboMemberReply
} from 'api/model/property/feeConfig/feeComboMemberModel'
import {
  FindFeeComboMember,
  CreateFeeComboMember,
  UpdateFeeComboMember,
  DeleteFeeComboMember
} from 'api/property/feeConfig/feeComboMember'

const namespace = 'FeeComboMember'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: FeeComboMemberReply[]
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
  async (params: FeeComboMemberParams & PaginationParams) => {
    const res = await FindFeeComboMember(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: FeeComboMemberParams) => {
    const res = await CreateFeeComboMember(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: FeeComboMemberParams) => {
    const res = await UpdateFeeComboMember(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteFeeComboMember(ids)
  return res
})

export const FeeComboMemberSlice = createSlice({
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

export const { reset } = FeeComboMemberSlice.actions

export const selectFeeComboMember = (state: RootState) => state.FeeComboMemberSlice

export default FeeComboMemberSlice.reducer
