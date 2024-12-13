import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  OrganizationInfoParams,
  OrganizationInfoReply,
  OrgUserReply
} from 'api/model/platform/organizationInfoModel'
import {
  FindOrganizationInfo,
  CreateOrganizationInfo,
  UpdateOrganizationInfo,
  DeleteOrganizationInfo,
  FindOrgUser
} from 'api/platform/organizationInfo'

const namespace = 'OrganizationInfo'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: OrganizationInfoReply[]
  orgUserList: OrgUserReply[]
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  orgUserList: []
}

export const findOrgUser = createAsyncThunk(
  `OrgUserReply/find`,
  async (params: OrgUserReply & PaginationParams) => {
    const res = await FindOrgUser(params)
    return res
  }
)

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: OrganizationInfoParams & PaginationParams) => {
    const res = await FindOrganizationInfo(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: OrganizationInfoParams) => {
    const res = await CreateOrganizationInfo(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: OrganizationInfoParams) => {
    const res = await UpdateOrganizationInfo(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteOrganizationInfo(ids)
  return res
})

export const OrganizationInfoSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(find.fulfilled, (state, action) => {
      state.list = action.payload.list
    })
    builder.addCase(findOrgUser.fulfilled, (state, action) => {
      state.page = action.payload.page
      state.orgUserList = action.payload.list
    })
  }
})

export const { reset } = OrganizationInfoSlice.actions

export const selectOrganizationInfo = (state: RootState) => state.OrganizationInfoSlice

export default OrganizationInfoSlice.reducer
