import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  SpectionPointParams,
  SpectionPointReply,
  SpectionRoutePointParams,
  SpectionRoutePointReply
} from 'api/model/property/spectionPointModel'
import {
  FindSpectionPoint,
  CreateSpectionPoint,
  UpdateSpectionPoint,
  DeleteSpectionPoint,
  CreatePoint,
  DeletePoint,
  FindPoint
} from 'api/property/spectionPoint'

const namespace = 'SpectionPoint'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: SpectionPointReply[]
  pointList: SpectionRoutePointReply[]
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  pointList: []
}

export const createPoint = createAsyncThunk(
  `${namespace}/create`,
  async (data: SpectionPointParams) => {
    const res = await CreatePoint(data)
    return res
  }
)

export const deletePoint = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeletePoint(ids)
  return res
})

export const findPoint = createAsyncThunk(
  `${namespace}/findPoint`,
  async (params: SpectionRoutePointParams & PaginationParams) => {
    const res = await FindPoint(params)
    return res
  }
)

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: SpectionPointParams & PaginationParams) => {
    const res = await FindSpectionPoint(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: SpectionPointParams) => {
  const res = await CreateSpectionPoint(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: SpectionPointParams) => {
  const res = await UpdateSpectionPoint(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteSpectionPoint(ids)
  return res
})

export const SpectionPointSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: builder => {
    builder
      // Handle loading state for `find` (SpectionPoint/find)
      .addCase(find.pending, state => {
        state.list = []
      })
      // Handle success for `find` (SpectionPoint/find)
      .addCase(find.fulfilled, (state, action) => {
        state.page = action.payload.page
        state.list = action.payload.list
      })
      // Handle failure for `find` (SpectionPoint/find)
      .addCase(find.rejected, state => {
        state.list = []
      })

      // Handle success for `findPoint` (SpectionPoint/findPoint)
      .addCase(findPoint.fulfilled, (state, action) => {
        state.pointList = action.payload.list
      })
  }
})

export const { reset } = SpectionPointSlice.actions

export const selectSpectionPoint = (state: RootState) => state.SpectionPointSlice

export default SpectionPointSlice.reducer
