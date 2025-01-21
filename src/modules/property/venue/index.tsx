import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { VenueParams, VenueReply } from 'api/model/property/venueModel'
import { FindVenue, CreateVenue, UpdateVenue, DeleteVenue } from 'api/property/venue'

const namespace = 'Venue'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: VenueReply[]
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
  async (params: VenueParams & PaginationParams) => {
    const res = await FindVenue(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: VenueParams) => {
  const res = await CreateVenue(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: VenueParams) => {
  const res = await UpdateVenue(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteVenue(ids)
  return res
})

export const VenueSlice = createSlice({
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

export const { reset } = VenueSlice.actions

export const selectVenue = (state: RootState) => state.VenueSlice

export default VenueSlice.reducer
