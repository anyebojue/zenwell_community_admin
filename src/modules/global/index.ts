import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IRouter } from 'routes'
import { Page } from 'api/model/pageModel'
import { UserInfoReply } from 'api/model/infoModel'
import { CityArea, userInfo } from 'api/info'
import { CityAreaReply } from 'api/model/cityModel'

const namespace = 'info'

const PAGE = {
  NUM: '1',
  SIZE: '20'
}

const InitUserInfo: UserInfoReply = {
  id: '',
  username: '',
  code: '',
  platform: '1',
  permission: {
    resources: [],
    menus: [],
    btns: []
  },
  community: []
}

interface CityAreaResponse {
  page: Page
  list: CityAreaReply[]
}

const CityAreaInitialState: CityAreaResponse = {
  page: {
    num: PAGE.NUM,
    size: PAGE.SIZE,
    total: '0',
    disable: false
  },
  list: []
}

const initialState = {
  token: localStorage.getItem('zenwell_token') || '',
  userInfo: { ...InitUserInfo },
  error: false,
  cityData: CityAreaInitialState
}

export const getCityArea = createAsyncThunk(`getCityArea`, async (params: PaginationParams) => {
  const res = await CityArea(params)
  return res
})

export const getUserInfo = createAsyncThunk(`${namespace}/getUserInfo`, async () => {
  const res = await userInfo()
  return res
})

export const permissionMenuPaths = (menus: string[], routeList: IRouter[]) => {
  const routesPaths: string[] = []
  if (menus.includes('*')) {
    routeList.forEach(route => {
      routesPaths.push(route.path)
      route.children?.forEach(childRouter => {
        const menu = `${route.path}/${childRouter.path}`
        if (menus.indexOf('*') !== -1 || menus.indexOf(menu) !== -1) {
          routesPaths.push(menu)
        }
      })
    })
  } else {
    routeList.forEach(route => {
      route.children?.forEach(childRouter => {
        const menu = `${route.path}/${childRouter.path}`
        if (menus.indexOf('*') !== -1 || menus.indexOf(menu) !== -1) {
          routesPaths.push(menu)
        }
      })
    })
  }
  return routesPaths
}

export const info = createSlice({
  name: namespace,
  initialState,
  reducers: {
    logout: state => {
      localStorage.removeItem('zenwell_token')
      state.token = ''
      state.userInfo = { ...InitUserInfo }
    },
    remove: state => {
      state.token = ''
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getUserInfo.pending, state => {
        state.userInfo.platform = ''
        state.error = false
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload
      })
      .addCase(getUserInfo.rejected, state => {
        state.error = true
      })
      .addCase(getCityArea.fulfilled, (state, action) => {
        state.cityData.page = action.payload.page
        state.cityData.list = action.payload.list
      })
  }
})

export const { logout, remove } = info.actions

export const selectUserInfo = (state: RootState) => state.info.userInfo

export default info.reducer
