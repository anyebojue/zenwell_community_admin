import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { SpacePersonParams, SpacePersonReply } from 'api/model/property/spacePersonModel'
import {
  FindSpacePerson,
  CreateSpacePerson,
  UpdateSpacePerson,
  DeleteSpacePerson
} from 'api/property/houses/spacePerson'

const namespace = 'SpacePerson'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpacePersonReply[]
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
  async (params: SpacePersonParams & PaginationParams) => {
    const res = await FindSpacePerson(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: SpacePersonParams) => {
  const res = await CreateSpacePerson(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: SpacePersonParams) => {
  const res = await UpdateSpacePerson(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpacePerson(ids)
  return res
})

export const SpacePersonSlice = createSlice({
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

export const { reset } = SpacePersonSlice.actions

export const selectSpacePerson = (state: RootState) => state.SpacePersonSlice

export default SpacePersonSlice.reducer
