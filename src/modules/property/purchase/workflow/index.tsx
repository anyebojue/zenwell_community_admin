import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { WorkflowParams, WorkflowReply } from 'api/model/property/purchase/workflowModel'
import {
  FindWorkflow,
  CreateWorkflow,
  UpdateWorkflow,
  DeleteWorkflow
} from 'api/property/purchase/workflow'

const namespace = 'Workflow'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: WorkflowReply[]
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
  async (params: WorkflowParams & PaginationParams) => {
    const res = await FindWorkflow(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: WorkflowParams) => {
  const res = await CreateWorkflow(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: WorkflowParams) => {
  const res = await UpdateWorkflow(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteWorkflow(ids)
  return res
})

export const WorkflowSlice = createSlice({
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

export const { reset } = WorkflowSlice.actions

export const selectWorkflow = (state: RootState) => state.WorkflowSlice

export default WorkflowSlice.reducer
