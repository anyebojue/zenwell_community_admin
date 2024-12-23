import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IRouter } from 'routes'
import { UserInfoReply } from 'api/model/infoModel'
import { userInfo } from 'api/info'

const namespace = 'info'

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
  company: {
    id: '-1',
    name: '',
    content: '',
    createdAt: '',
    updatedAt: ''
  }
}

const initialState = {
  token: localStorage.getItem('zenwell_token') || '',
  userInfo: { ...InitUserInfo },
  error: false
}

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
  }
})

export const { logout, remove } = info.actions

export const selectUserInfo = (state: RootState) => state.info.userInfo

export default info.reducer
