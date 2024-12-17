import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { RolesParams, RolesReply, RolesGroupReply } from 'api/model/platform/rolesModel'
import {
  FindRoles,
  CreateRoles,
  UpdateRoles,
  DeleteRoles,
  FindRolesGroup,
  RelevanceCommunity
} from 'api/platform/roles'

const namespace = 'Roles'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: RolesReply[]
  rolesGroupList: RolesGroupReply[]
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  rolesGroupList: []
}

export const relevanceCommunity = createAsyncThunk(
  `RolesGroup/create`,
  async (data: { userGroupId: string; communityId: string }) => {
    const res = await RelevanceCommunity(data)
    return res
  }
)

export const findRolesGroup = createAsyncThunk(
  `RolesGroup/find`,
  async (params: RolesGroupReply & PaginationParams) => {
    const res = await FindRolesGroup(params)
    return res
  }
)

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: RolesParams & PaginationParams) => {
    const res = await FindRoles(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: RolesParams) => {
  const res = await CreateRoles(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: RolesParams) => {
  const res = await UpdateRoles(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteRoles(ids)
  return res
})

export const RolesSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(find.fulfilled, (state, action) => {
      state.list = action.payload.list
    })
    builder.addCase(findRolesGroup.fulfilled, (state, action) => {
      state.page = action.payload.page
      state.rolesGroupList = action.payload.list
    })
  }
})

export const { reset } = RolesSlice.actions

export const selectRoles = (state: RootState) => state.RolesSlice

export default RolesSlice.reducer
