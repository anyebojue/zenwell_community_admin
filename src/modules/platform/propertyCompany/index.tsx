import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import {
  CompanyReply,
  PropertyCompanyParams,
  PropertyCompanyReply
} from 'api/model/platform/propertyCompanyModel'
import {
  FindCompany,
  CreateCompany,
  DeleteCompany,
  FindPropertyCompany,
  CreatePropertyCompany,
  UpdatePropertyCompany,
  DeletePropertyCompany
} from 'api/platform/propertyCompany'

const namespace = 'PropertyCompany'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: PropertyCompanyReply[]
  companyList: CompanyReply[]
}

const initialState: IInitialState = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: [],
  companyList: []
}

export const companyfind = createAsyncThunk(
  `company/find`,
  async (params: PaginationParams & CompanyReply) => {
    const res = await FindCompany(params)
    return res
  }
)

export const companycreate = createAsyncThunk(
  `company/create`,
  async (data: { storeId: string; communityId: string }) => {
    const res = await CreateCompany(data)
    return res
  }
)

export const companydeleteById = createAsyncThunk(`company/deleteByIds`, async (id: string) => {
  const res = await DeleteCompany(id)
  return res
})

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: PropertyCompanyParams & PaginationParams) => {
    const res = await FindPropertyCompany(params)
    return res
  }
)

export const create = createAsyncThunk(
  `${namespace}/create`,
  async (data: PropertyCompanyParams) => {
    const res = await CreatePropertyCompany(data)
    return res
  }
)

export const update = createAsyncThunk(
  `${namespace}/update`,
  async (data: PropertyCompanyParams) => {
    const res = await UpdatePropertyCompany(data)
    return res
  }
)

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeletePropertyCompany(ids)
  return res
})

export const PropertyCompanySlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    reset: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(find.fulfilled, (state, action) => {
      state.page = action.payload.page
      state.list = action.payload.list
    })
    builder.addCase(companyfind.fulfilled, (state, action) => {
      state.page = action.payload.page
      state.companyList = action.payload.list
    })
  }
})

export const { reset } = PropertyCompanySlice.actions

export const selectPropertyCompany = (state: RootState) => state.PropertyCompanySlice

export default PropertyCompanySlice.reducer
