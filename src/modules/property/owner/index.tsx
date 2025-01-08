import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { OwnerParams, OwnerReply } from 'api/model/property/ownerModel'
import { FindOwner, CreateOwner, UpdateOwner, DeleteOwner, GetOwner } from 'api/property/owner'

const namespace = 'Owner'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: OwnerReply[]
  owner: OwnerReply
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  owner: {}
}

export const get = createAsyncThunk(`${namespace}/get`, async (params: { id: string }) => {
  const res = await GetOwner(params)
  return res
})

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: OwnerParams & PaginationParams) => {
    const res = await FindOwner(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: OwnerParams) => {
  const res = await CreateOwner(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: OwnerParams) => {
  const res = await UpdateOwner(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteOwner(ids)
  return res
})

export const OwnerSlice = createSlice({
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

export const { reset } = OwnerSlice.actions

export const selectOwner = (state: RootState) => state.OwnerSlice

export default OwnerSlice.reducer
