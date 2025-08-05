import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  SpectionPlanParams,
  SpectionPlanReply
} from 'api/model/property/inspection/spectionPlanModel'
import { create, find, update } from 'modules/property/inspection/spectionPlan'
import {
  Box,
  CircularProgress,
  FormLabel,
  MenuItem,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  List,
  Typography,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material'
import message from 'components/Message'
import { buttonStyles } from 'components/DeleteModal'
import { RichTreeView, TreeViewBaseItem } from '@mui/x-tree-view'
import { Work } from '@mui/icons-material'
import {
  OrganizationInfoReply,
  OrgUserReply
} from 'api/model/platform/organization/organizationInfoModel'
import { find as treeFind, findOrgUser } from 'modules/platform/organization/organizationInfo'
import { find as routeFind } from 'modules/property/inspection/spectionRoute'

interface FormDialogProps {
  dialogValue?: SpectionPlanReply
  openDialog: boolean
  dialogType: string
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const FormDialog: React.FC<FormDialogProps> = ({
  dialogValue,
  openDialog,
  dialogType,
  setOpenDialog
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { page, list, orgUserList } = useSelector((state: RootState) => state.OrganizationInfoSlice)
  const { list: routeList } = useSelector((state: RootState) => state.SpectionRouteSlice)
  const [loading, setLoading] = useState(false)
  const [selectedMonths, setSelectedMonths] = useState<number[]>([])
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([])
  const [dialogUserValue, setDialogUserValue] = useState<OrganizationInfoReply>({})
  const [employeeList, setEmployeeList] = useState<OrgUserReply[]>([])

  const fetchData = useCallback(
    async (action: Function, params: Record<string, boolean | string>, loadingMessage: string) => {
      const closeLoading = message.loading(loadingMessage)
      try {
        const res = await dispatch(action(params))
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
      } catch (err: unknown) {
        if (err instanceof Error) message.error(err.message)
      } finally {
        closeLoading()
      }
    },
    [dispatch]
  )

  const transformData = useMemo(() => {
    const transformNode = (node: OrganizationInfoReply): TreeViewBaseItem => ({
      id: node.id as string,
      label: node.name as string,
      children: node.children?.length ? node.children.map(transformNode) : []
    })
    return list?.map(transformNode) || []
  }, [list])

  const initialFormData = useMemo(
    () => ({
      inspectionPlanName: dialogType === 'edit' ? dialogValue?.inspectionPlanName || '' : '',
      inspectionRouteId: dialogType === 'edit' ? dialogValue?.inspectionRouteId || '' : '',
      inspectionPlanPeriod: dialogType === 'edit' ? dialogValue?.inspectionPlanPeriod || 0 : 0,
      beforeTime: dialogType === 'edit' ? dialogValue?.beforeTime || 0 : 0,
      startDate: dialogType === 'edit' ? dialogValue?.startDate || '' : '',
      endDate: dialogType === 'edit' ? dialogValue?.endDate || '' : '',
      startTime: dialogType === 'edit' ? dialogValue?.startTime || '' : '',
      endTime: dialogType === 'edit' ? dialogValue?.endTime || '' : '',
      signType: dialogType === 'edit' ? dialogValue?.signType || 0 : 0,
      canReexamine: dialogType === 'edit' ? dialogValue?.canReexamine || 0 : 0,
      createUserId: dialogType === 'edit' ? dialogValue?.createUserId || '' : ''
    }),
    [dialogType, dialogValue]
  )
  const [formData, setFormData] = useState<SpectionPlanParams>(initialFormData)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const weekdays = [
    { value: 1, label: '星期一' },
    { value: 2, label: '星期二' },
    { value: 3, label: '星期三' },
    { value: 4, label: '星期四' },
    { value: 5, label: '星期五' },
    { value: 6, label: '星期六' },
    { value: 7, label: '星期日' }
  ]

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      const current_community = localStorage.getItem('current_community')
      const community = JSON.parse(current_community || '')
      try {
        const params = {
          ...formData,
          inspectionMonth: selectedMonths.join(','),
          inspectionDay: selectedDays.join(','),
          inspectionWorkday: selectedWeekdays.join(','),
          staffId: employeeList.map(item => item.id).join(','),
          communityId: community.id
        }
        const action =
          dialogType === 'add' ? create(params) : update({ id: dialogValue?.id, ...params })
        const res = await dispatch(action)
        if ('error' in res && res.error?.message) {
          throw new Error(res.error.message)
        }
        await dispatch(find({ 'page.num': page.num || '1', 'page.size': page.size }))
        message.success(dialogType === 'add' ? '新建成功' : '编辑成功')
        setOpenDialog(false)
        setFormData(initialFormData)
      } catch (err: unknown) {
        setLoading(false)
        if (err instanceof Error) message.error(err.message)
      } finally {
        setLoading(false)
      }
    },
    [
      formData,
      selectedMonths,
      selectedDays,
      selectedWeekdays,
      employeeList,
      dialogType,
      dialogValue?.id,
      dispatch,
      page.num,
      page.size,
      setOpenDialog,
      initialFormData
    ]
  )

  const formFields = [{ label: '计划名称', type: 'text', id: 'inspectionPlanName', required: true }]

  useEffect(() => {
    if (openDialog) {
      fetchData(
        routeFind,
        { 'page.num': page.num, 'page.size': page.size },
        '正在加载列表中，请稍后...'
      )
      fetchData(treeFind, { pId: '0' }, '正在加载列表中，请稍后...')
      fetchData(
        findOrgUser,
        { 'page.disable': true, orgId: '9032183211253301249' },
        '正在加载列表中，请稍后...'
      )
    }
  }, [fetchData, openDialog, page.num, page.size])

  const findItemById = useCallback(
    (items: OrganizationInfoReply[], targetId: string): OrganizationInfoReply | null => {
      for (const item of items) {
        if (item.id === targetId) return item
        if (item.children?.length) {
          const foundInChildren = findItemById(item.children, targetId)
          fetchData(
            findOrgUser,
            { 'page.disable': true, orgId: foundInChildren?.id || '' },
            '正在加载列表中，请稍后...'
          )
          if (foundInChildren) return foundInChildren
        }
      }
      return null
    },
    [fetchData]
  )

  const handleListItemClick = async (row: OrgUserReply) => {
    const isAlreadySelected = employeeList.some(item => item.id === row.id)
    if (isAlreadySelected) {
      message.warning('你已经选择了这个员工！')
      return
    }
    setEmployeeList(prevList => [...prevList, row])
  }

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      slotProps={{ paper: { component: 'form', onSubmit: handleSubmit } }}
    >
      <DialogTitle>{dialogType === 'add' ? '新增' : '编辑'}</DialogTitle>
      <DialogContent dividers sx={{ margin: '0 10px 0' }}>
        <Stack spacing={3}>
          {formFields.map(({ label, type, id, required }) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              key={id}
            >
              <FormLabel>{label}：</FormLabel>
              <TextField
                placeholder="请输入"
                type={type}
                sx={{ width: '80%' }}
                size="small"
                required={required}
                id={id}
                value={formData[id as keyof SpectionPlanParams]}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                autoComplete={type === 'password' ? 'current-password' : ''}
              />
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>巡检路线：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.inspectionRouteId || ''}
              onChange={e => {
                console.log('Selected Route ID:', e.target.value)
                setFormData({ ...formData, inspectionRouteId: e.target.value })
              }}
              variant="outlined"
            >
              {routeList.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>任务提前：</FormLabel>
            <TextField
              sx={{ width: '63%' }}
              size="small"
              value={formData.beforeTime}
              onChange={e => setFormData({ ...formData, beforeTime: Number(e.target.value) })}
              variant="outlined"
            />
            <FormLabel>分钟生成</FormLabel>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>巡检周期：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.inspectionPlanPeriod || ''}
              onChange={e =>
                setFormData({ ...formData, inspectionPlanPeriod: Number(e.target.value) })
              }
              variant="outlined"
            >
              <MenuItem value={1}>月/天</MenuItem>
              <MenuItem value={2}>按周</MenuItem>
            </TextField>
          </Box>

          {formData.inspectionPlanPeriod === 1 && (
            <>
              <FormLabel>选择月份：</FormLabel>
              <FormGroup row>
                {months.map(month => (
                  <FormControlLabel
                    key={month}
                    control={
                      <Checkbox
                        checked={selectedMonths.includes(month)}
                        onChange={() =>
                          setSelectedMonths(prev =>
                            prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
                          )
                        }
                      />
                    }
                    label={`${month}月`}
                  />
                ))}
              </FormGroup>
              <FormLabel>选择日期：</FormLabel>
              <FormGroup row>
                {days.map(day => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={selectedDays.includes(day)}
                        onChange={() =>
                          setSelectedDays(prev =>
                            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                          )
                        }
                      />
                    }
                    label={`${day}日`}
                  />
                ))}
              </FormGroup>
            </>
          )}

          {formData.inspectionPlanPeriod === 2 && (
            <>
              <FormLabel>选择星期：</FormLabel>
              <FormGroup row>
                {weekdays.map(({ value, label }) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        checked={selectedWeekdays.includes(value)}
                        onChange={() =>
                          setSelectedWeekdays(prev =>
                            prev.includes(value) ? prev.filter(w => w !== value) : [...prev, value]
                          )
                        }
                      />
                    }
                    label={label}
                  />
                ))}
              </FormGroup>
            </>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>开始日期：</FormLabel>
            <TextField
              type="date"
              sx={{ width: '80%' }}
              size="small"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>开始时间：</FormLabel>
            <TextField
              type="time"
              sx={{ width: '80%' }}
              size="small"
              value={formData.startTime}
              onChange={e => setFormData({ ...formData, startTime: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>结束日期：</FormLabel>
            <TextField
              type="date"
              sx={{ width: '80%' }}
              size="small"
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>结束时间：</FormLabel>
            <TextField
              type="time"
              sx={{ width: '80%' }}
              size="small"
              value={formData.endTime}
              onChange={e => setFormData({ ...formData, endTime: e.target.value })}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>签到方式：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.signType}
              onChange={e => setFormData({ ...formData, signType: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { value: 0, label: '现场定位' },
                { value: 1, label: '现场拍照(默认定位)' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormLabel>允许补检：</FormLabel>
            <TextField
              sx={{ width: '80%' }}
              select
              size="small"
              value={formData.canReexamine}
              onChange={e => setFormData({ ...formData, canReexamine: Number(e.target.value) })}
              variant="outlined"
            >
              {[
                { value: 0, label: '不允许' },
                { value: 1, label: '允许' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Stack>
        <Box>
          <Typography sx={{ pt: 5, pb: 3 }}>选择员工：</Typography>
          <Box sx={{ display: 'flex' }}>
            <RichTreeView
              sx={{ width: '600px', mr: 2 }}
              items={transformData}
              defaultExpandedItems={['9032183211253301249']}
              selectedItems={dialogUserValue?.id ?? ''}
              onSelectedItemsChange={(_, selectedItemId) => {
                if (!selectedItemId) return
                const item = findItemById(list, selectedItemId)
                if (item) setDialogUserValue(item)
              }}
              expansionTrigger="iconContainer" // 只有点击左边的按钮才展开
            />
            <Divider orientation="vertical" flexItem />
            <List sx={{ ml: 2, width: '100%', bgcolor: 'background.paper' }}>
              {orgUserList.length === 0 ? (
                <Typography sx={{ textAlign: 'center', color: 'gray' }}>暂无数据</Typography>
              ) : (
                orgUserList.map(item => (
                  <ListItemButton
                    key={item.id}
                    onClick={() => handleListItemClick(item)}
                    sx={{
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        backgroundColor: 'rgba(0, 0, 0, 0.08)'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Work />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.users?.username} secondary={item.users?.mobile} />
                  </ListItemButton>
                ))
              )}
            </List>
            <Divider orientation="vertical" flexItem />
            <List sx={{ ml: 2, width: '100%', bgcolor: 'background.paper' }}>
              {employeeList.length === 0 ? (
                <Typography sx={{ textAlign: 'center', color: 'gray' }}>暂无数据</Typography>
              ) : (
                employeeList.map(item => (
                  <ListItemButton
                    key={item.id}
                    onClick={() => handleListItemClick(item)}
                    sx={{
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        backgroundColor: 'rgba(0, 0, 0, 0.08)'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Work />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.users?.username} secondary={item.users?.mobile} />
                  </ListItemButton>
                ))
              )}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={() => setOpenDialog(false)}>
          取消
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="error"
          sx={buttonStyles('#2660ad', '#1d428a')}
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} color="inherit" />}
        >
          {loading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(FormDialog)
