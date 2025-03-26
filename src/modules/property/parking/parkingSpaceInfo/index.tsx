import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  ParkingSpaceInfoParams,
  ParkingSpaceInfoReply
} from 'api/model/property/parking/parkingSpaceInfoModel'
import {
  FindParkingSpaceInfo,
  CreateParkingSpaceInfo,
  UpdateParkingSpaceInfo,
  DeleteParkingSpaceInfo,
  BatchCreateParkingSpaceInfo
} from 'api/property/parking/parkingSpaceInfo'

const namespace = 'ParkingSpaceInfo'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: ParkingSpaceInfoReply[]
  parkingSpaceInfo: ParkingSpaceInfoReply
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  parkingSpaceInfo: {}
}

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: ParkingSpaceInfoParams & PaginationParams) => {
    const res = await FindParkingSpaceInfo(params)
    return res
  }
)

export const batchCreate = createAsyncThunk(
  `${namespace}/create`,
  async (data: {
    preNum: string
    startNum: string
    endNum: string
    paId: string
    parkingType: string
    communityId: string
  }) => {
    const res = await BatchCreateParkingSpaceInfo(data)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: ParkingSpaceInfoParams) => {
    const res = await CreateParkingSpaceInfo(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: ParkingSpaceInfoParams) => {
    const res = await UpdateParkingSpaceInfo(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteParkingSpaceInfo(ids)
  return res
})

export const ParkingSpaceInfoSlice = createSlice({
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

export const { reset } = ParkingSpaceInfoSlice.actions

export const selectParkingSpaceInfo = (state: RootState) => state.ParkingSpaceInfoSlice

export default ParkingSpaceInfoSlice.reducer
