import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { SpaceParams, SpaceReply } from 'api/model/property/houses/spaceModel'
import { FindSpace, CreateSpace, UpdateSpace, DeleteSpace } from 'api/property/houses/space'

const namespace = 'Space'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpaceReply[]
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
  async (params: SpaceParams & PaginationParams) => {
    const res = await FindSpace(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: SpaceParams) => {
  const res = await CreateSpace(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: SpaceParams) => {
  const res = await UpdateSpace(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpace(ids)
  return res
})

export const SpaceSlice = createSlice({
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

export const { reset } = SpaceSlice.actions

export const selectSpace = (state: RootState) => state.SpaceSlice

export default SpaceSlice.reducer
