import { memo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenuReply } from 'api/model/develop/menuModel'
import { RolesReply } from 'api/model/platform/rolesModel'
import { findMenus } from 'modules/develop/menu'
import { Box } from '@mui/material'
import { RichTreeView } from '@mui/x-tree-view'
import message from 'components/Message'

interface FeatureProps {
  dialogValue: RolesReply
}

const Feature: React.FC<FeatureProps> = ({ dialogValue }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { list } = useSelector((state: RootState) => state.MenuSlice)
  console.log(dialogValue)

  const renameNameToLabel = (obj: MenuReply[]): MenuReply[] => {
    return obj.map(({ name, children, ...rest }) => ({
      label: name,
      children: children ? renameNameToLabel(children) : undefined,
      ...rest
    }))
  }

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(findMenus({ pId: '0' }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch {
      message.error('列表加载失败，请刷新页面或检查网络问题')
    } finally {
      closeLoading()
    }
  }, [dispatch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const transformedList: MenuReply[] = Array.isArray(list) ? renameNameToLabel(list) : []

  return (
    <Box>
      <RichTreeView multiSelect checkboxSelection items={transformedList} />
    </Box>
  )
}

export default memo(Feature)
