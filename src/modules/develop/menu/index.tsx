import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Page } from 'api/model/pageModel'
import { MenuParams, MenuReply } from 'api/model/develop/menuModel'
import { FindMenu, CreateMenu, UpdateMenu, DeleteMenu, FindMenus } from 'api/develop/menu'

const namespace = 'Menu'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

interface IInitialState {
  page: Page
  list: MenuReply[]
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

export const findMenus = createAsyncThunk(
  `${namespace}/find`,
  async (params: MenuParams & PaginationParams) => {
    const res = await FindMenus(params)
    return res
  }
)

export const find = createAsyncThunk(
  `${namespace}/find`,
  async (params: MenuParams & PaginationParams) => {
    const res = await FindMenu(params)
    return res
  }
)

export const create = createAsyncThunk(`${namespace}/create`, async (data: MenuParams) => {
  const res = await CreateMenu(data)
  return res
})

export const update = createAsyncThunk(`${namespace}/update`, async (data: MenuParams) => {
  const res = await UpdateMenu(data)
  return res
})

export const deleteByIds = createAsyncThunk(`${namespace}/deleteByIds`, async (ids: string[]) => {
  const res = await DeleteMenu(ids)
  return res
})

export const MenuSlice = createSlice({
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

export const { reset } = MenuSlice.actions

export const selectMenu = (state: RootState) => state.MenuSlice

export default MenuSlice.reducer
