import { Dispatch, Fragment, memo, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReleaseReply } from 'api/model/property/releaseModel'
import { find } from 'modules/property/release'
import { find as findReleaseType } from 'modules/property/releaseType'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import message from 'components/Message'
import TableList from './TableList'

export interface Column<T> {
  headerName: string
  key: keyof T | 'operate'
  align?: 'left' | 'center' | 'right'
  renderCell?: (row: T) => ReactNode
}

interface TableDataProps {
  dialogValue: ReleaseReply | undefined
  setDialogType: Dispatch<SetStateAction<string>>
  setDialogValue: Dispatch<SetStateAction<ReleaseReply | undefined>>
  selectedRows: Set<string | undefined>
  setSelectedRows: Dispatch<SetStateAction<Set<string | undefined>>>
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setDelOpen: Dispatch<SetStateAction<boolean>>
}

const TableData: React.FC<TableDataProps> = ({
  setDialogType,
  setDialogValue,
  selectedRows,
  setSelectedRows,
  setOpenDialog,
  setDelOpen
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list } = useSelector((state: RootState) => state.ReleaseSlice)

  const columns: Column<ReleaseReply>[] = [
    { key: 'id', headerName: '单号', align: 'center' },
    {
      key: 'typeId',
      headerName: '放行类型',
      align: 'center',
      renderCell: row => (row.releaseType ? row.releaseType[0].typeName : '')
    },
    { key: 'applyCompany', headerName: '申请单位', align: 'center' },
    { key: 'applyPerson', headerName: '申请人', align: 'center' },
    { key: 'idCard', headerName: '身份证', align: 'center' },
    { key: 'applyTel', headerName: '手机号', align: 'center' },
    { key: 'passTime', headerName: '通行时间', align: 'center' },
    {
      key: 'releaseRes',
      headerName: '物品',
      align: 'center',
      renderCell: row => (
        <Box>
          {row.releaseRes?.map((item, index) => (
            <Fragment key={index}>
              名称：{item.resName}；数量：{item.amount}
              <br />
            </Fragment>
          ))}
        </Box>
      )
    },
    {
      key: 'statusCd',
      headerName: '状态',
      align: 'center',
      renderCell: row =>
        row.statusCd === 'W'
          ? '待审核'
          : row.statusCd === 'D'
            ? '审核中'
            : row.statusCd === 'C'
              ? '审核完成'
              : row.statusCd === 'D'
                ? '审核失败'
                : ''
    },
    { key: 'carNum', headerName: '车牌号', align: 'center' },
    {
      key: 'operate',
      headerName: '操作',
      align: 'center',
      renderCell: () => (
        <Box>
          {[
            {
              title: '修改',
              color: 'secondary' as const,
              icon: <Edit fontSize="small" />,
              onClick: () => {
                setOpenDialog(true)
                setDialogType('edit')
              }
            },
            {
              title: '删除',
              color: 'error' as const,
              icon: <Delete fontSize="small" />,
              onClick: () => setDelOpen(true)
            }
          ].map((action, index) => (
            <Tooltip title={action.title} key={index}>
              <IconButton size="small" color={action.color} onClick={action.onClick}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      )
    }
  ]

  const fetchData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(find({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  const fetchReleaseTypeData = useCallback(async () => {
    const closeLoading = message.loading('正在加载列表中，请稍后...')
    try {
      const res = await dispatch(findReleaseType({ 'page.num': page.num, 'page.size': page.size }))
      if ('error' in res && res.error?.message) {
        throw new Error(res.error.message)
      }
    } catch (err: unknown) {
      closeLoading()
      if (err instanceof Error) message.error(err.message)
    } finally {
      closeLoading()
    }
  }, [dispatch, page.num, page.size])

  useEffect(() => {
    fetchData()
    fetchReleaseTypeData()
  }, [fetchData, fetchReleaseTypeData])

  return (
    <TableList
      rows={list}
      columns={columns}
      setDialogValue={setDialogValue}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}

export default memo(TableData)
