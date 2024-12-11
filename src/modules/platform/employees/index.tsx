import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { EmployeesParams, EmployeesReply } from 'api/model/platform/employeesModel'
import {
  FindEmployees,
  CreateEmployees,
  UpdateEmployees,
  DeleteEmployees
} from 'api/platform/employees'

const namespace = 'Employees'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: EmployeesReply[]
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
  async (params: EmployeesParams & PaginationParams) => {
    const res = await FindEmployees(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: EmployeesParams) => {
  const res = await CreateEmployees(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: EmployeesParams) => {
  const res = await UpdateEmployees(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteEmployees(ids)
  return res
})

export const EmployeesSlice = createSlice({
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
  }
})

export const { reset } = EmployeesSlice.actions

export const selectEmployees = (state: RootState) => state.EmployeesSlice

export default EmployeesSlice.reducer
