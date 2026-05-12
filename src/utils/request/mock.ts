import { AxiosRequestConfig, AxiosResponse } from 'axios'

type HttpMethod = 'get' | 'post' | 'patch' | 'delete'

type MockRecord = Record<string, any>

const DEFAULT_PAGE_SIZE = 4

const database = new Map<string, MockRecord[]>()

const imagePlaceholder = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f766e"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>
    <rect width="640" height="360" fill="url(#bg)"/>
    <circle cx="120" cy="90" r="48" fill="rgba(255,255,255,0.18)"/>
    <circle cx="520" cy="280" r="72" fill="rgba(255,255,255,0.14)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#ffffff"
      font-family="Arial, sans-serif" font-size="34" font-weight="700">Mock Preview</text>
  </svg>
`)}`

const COMMUNITY_LIST = [
  {
    id: 'community-001',
    bId: 'ZW001',
    name: '云栖花园',
    address: '上海市浦东新区芳甸路 188 号',
    nearbyLandmarks: '近世纪公园 300 米',
    cityCode: '310115',
    mapX: '121.5448',
    mapY: '31.2291',
    statusCd: '0',
    state: '1200',
    communityArea: 128000,
    tel: '021-50338888',
    payFeeMonth: 12,
    feePrice: 3.8,
    qrCode: imagePlaceholder,
    createdAt: '2026-05-01 09:00:00',
    updatedAt: '2026-05-12 10:00:00'
  },
  {
    id: 'community-002',
    bId: 'ZW002',
    name: '春和景明城',
    address: '上海市闵行区都会路 699 号',
    nearbyLandmarks: '近颛桥地铁站',
    cityCode: '310112',
    mapX: '121.4077',
    mapY: '31.1123',
    statusCd: '0',
    state: '1200',
    communityArea: 98000,
    tel: '021-64889999',
    payFeeMonth: 6,
    feePrice: 4.2,
    qrCode: imagePlaceholder,
    createdAt: '2026-04-21 14:00:00',
    updatedAt: '2026-05-11 16:00:00'
  }
]

const fallbackParkingSpace = (index = 0) => ({
  id: `parking-space-${String(index + 1).padStart(3, '0')}`,
  num: `P${String(100 + index)}`,
  name: `车位 ${index + 1}`
})

const fallbackReleaseType = (index = 0) => ({
  id: `release-type-${String(index + 1).padStart(3, '0')}`,
  typeName: ['家具放行', '装修放行', '设备出门', '物资搬运'][index % 4]
})

const fallbackReleaseRes = (index = 0) => [
  {
    id: `release-res-${String(index + 1).padStart(3, '0')}`,
    resName: ['办公椅', '显示器', '工具箱', '档案盒'][index % 4],
    amount: String((index % 3) + 1),
    remark: '模拟放行物品'
  }
]

const MENU_TREE = [
  {
    id: 'menu-communitys',
    name: '社区管理',
    code: 'communitys',
    menu: '/communitys',
    sort: '1',
    isShow: 1,
    children: [
      {
        id: 'menu-community-announcement',
        name: '小区公示',
        code: 'communityAnnouncement',
        menu: '/communitys/communityAnnouncement',
        pId: 'menu-communitys',
        sort: '1',
        isShow: 1
      },
      {
        id: 'menu-goods-release',
        name: '放行条',
        code: 'goodsRelease',
        menu: '/communitys/goodsRelease',
        pId: 'menu-communitys',
        sort: '2',
        isShow: 1
      }
    ]
  },
  {
    id: 'menu-houses',
    name: '房产管理',
    code: 'houses',
    menu: '/houses',
    sort: '2',
    isShow: 1,
    children: [
      {
        id: 'menu-owner',
        name: '业主信息',
        code: 'owner',
        menu: '/houses/ownerInformation',
        pId: 'menu-houses',
        sort: '1',
        isShow: 1
      },
      {
        id: 'menu-room',
        name: '房屋管理',
        code: 'room',
        menu: '/houses/housingManagement',
        pId: 'menu-houses',
        sort: '2',
        isShow: 1
      }
    ]
  },
  {
    id: 'menu-parking',
    name: '停车管理',
    code: 'parking',
    menu: '/parking',
    sort: '3',
    isShow: 1,
    children: [
      {
        id: 'menu-owner-car',
        name: '业主车辆',
        code: 'ownerCar',
        menu: '/parking/ownerVehicle',
        pId: 'menu-parking',
        sort: '1',
        isShow: 1
      },
      {
        id: 'menu-parking-space',
        name: '车位信息',
        code: 'parkingSpaceInfo',
        menu: '/parking/parkingSpaceInfo',
        pId: 'menu-parking',
        sort: '2',
        isShow: 1
      }
    ]
  }
]

const nowString = (offset = 0) => {
  const date = new Date(Date.now() - offset * 86400000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const toTitle = (value: string) =>
  value
    .split(/[_-]/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const fallbackValueByKey = (key: string, index = 0): any => {
  const normalized = String(key)

  const exactMap: Record<string, any> = {
    applyCompany: `申请单位${index + 1}`,
    applyPerson: `申请人${index + 1}`,
    applyTel: `1380000${String(index + 1).padStart(4, '0')}`,
    idCard: `31010119900${String(index + 1).padStart(6, '0')}`,
    passTime: nowString(index),
    carNum: `沪A${String(2000 + index).padStart(5, '0')}`,
    tel: `1360000${String(index + 1).padStart(4, '0')}`,
    mobile: `1390000${String(index + 1).padStart(4, '0')}`,
    link: `1370000${String(index + 1).padStart(4, '0')}`,
    releaseType: [fallbackReleaseType(index)],
    releaseRes: fallbackReleaseRes(index),
    parkingSpace: fallbackParkingSpace(index),
    parkingSpaceInfo: fallbackParkingSpace(index),
    owner: {
      id: `owner-${String(index + 1).padStart(3, '0')}`,
      name: `业主${index + 1}`,
      link: `1380000${String(index + 1).padStart(4, '0')}`
    },
    org: [
      {
        id: `org-${String(index + 1).padStart(3, '0')}`,
        name: `组织 ${index + 1}`
      }
    ]
  }

  if (normalized in exactMap) {
    return exactMap[normalized]
  }

  if (normalized.endsWith('Name') || normalized === 'name' || normalized === 'title') {
    return `${toTitle(normalized)} ${index + 1}`
  }
  if (normalized.includes('Company') || normalized.includes('company')) {
    return `单位${index + 1}`
  }
  if (normalized.includes('Person') || normalized.includes('User') || normalized.includes('user')) {
    return `人员${index + 1}`
  }
  if (normalized.includes('Phone') || normalized.includes('phone') || normalized.includes('Tel') || normalized.includes('tel')) {
    return `1380000${String(index + 1).padStart(4, '0')}`
  }
  if (normalized.includes('Card')) {
    return `31010119900${String(index + 1).padStart(6, '0')}`
  }
  if (normalized.includes('Time') || normalized.endsWith('At') || normalized.includes('Date')) {
    return nowString(index)
  }
  if (normalized.includes('Amount') || normalized.includes('Price') || normalized.includes('Fee') || normalized.includes('Stock') || normalized.includes('Total') || normalized.includes('score')) {
    return String(100 + index * 10)
  }
  if (normalized.includes('Num') || normalized === 'num' || normalized.includes('Code') || normalized === 'id') {
    return `${normalized.toUpperCase().slice(0, 4)}-${String(index + 1).padStart(3, '0')}`
  }
  if (normalized.includes('Status') || normalized === 'statusCd' || normalized === 'state') {
    return '0'
  }
  if (normalized.includes('Remark') || normalized === 'remark' || normalized === 'description' || normalized === 'content') {
    return '模拟数据展示内容'
  }
  if (normalized.includes('Address') || normalized === 'address') {
    return `上海市示例路 ${index + 1} 号`
  }
  if (normalized.includes('Area')) {
    return String(80 + index)
  }

  return `${toTitle(normalized)} ${index + 1}`
}

const ensureDisplayData = (record: MockRecord, index = 0, depth = 0): MockRecord => {
  const topLevelDefaults: MockRecord = {
    id: `row-${String(index + 1).padStart(3, '0')}`,
    code: `CODE-${String(index + 1).padStart(3, '0')}`,
    name: `数据 ${index + 1}`,
    title: `标题 ${index + 1}`,
    remark: '模拟数据展示内容',
    description: '模拟数据展示内容',
    content: '模拟数据展示内容',
    statusCd: '0',
    state: '0',
    createdAt: nowString(index),
    updatedAt: nowString(index),
    startTime: nowString(index),
    endTime: nowString(index),
    amount: String(100 + index * 10),
    totalAmount: String(100 + index * 10),
    totalFee: String(100 + index * 10),
    price: String(100 + index * 10),
    mobile: `1390000${String(index + 1).padStart(4, '0')}`,
    tel: `1360000${String(index + 1).padStart(4, '0')}`,
    link: `1370000${String(index + 1).padStart(4, '0')}`,
    address: `上海市示例路 ${index + 1} 号`,
    ownerName: `业主${index + 1}`,
    applyCompany: `申请单位${index + 1}`,
    applyPerson: `申请人${index + 1}`,
    applyTel: `1380000${String(index + 1).padStart(4, '0')}`,
    idCard: `31010119900${String(index + 1).padStart(6, '0')}`,
    passTime: nowString(index)
  }

  const nestedDefaults: MockRecord = {
    id: `nested-${String(index + 1).padStart(3, '0')}`,
    name: `子项 ${index + 1}`,
    remark: '模拟数据展示内容'
  }

  const seed = depth === 0 ? { ...topLevelDefaults, ...record } : { ...nestedDefaults, ...record }

  const normalizedEntries = Object.entries(seed).map(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return [key, fallbackValueByKey(key, index)]
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return [key, fallbackValueByKey(key, index)]
      }

      if (depth >= 1) {
        return [key, value]
      }

      return [
        key,
        value.map((item, itemIndex) =>
          item && typeof item === 'object' ? ensureDisplayData(item, itemIndex, depth + 1) : item
        )
      ]
    }

    if (value && typeof value === 'object') {
      if (depth >= 1) {
        return [key, value]
      }
      return [key, ensureDisplayData(value, index, depth + 1)]
    }

    return [key, value]
  })

  const result = Object.fromEntries(normalizedEntries)

  if (depth === 0) {
    if (!result.parkingSpace) result.parkingSpace = fallbackParkingSpace(index)
    if (!result.parkingSpaceInfo) result.parkingSpaceInfo = fallbackParkingSpace(index)
    if (!result.releaseType) result.releaseType = [fallbackReleaseType(index)]
    if (!result.releaseRes) result.releaseRes = fallbackReleaseRes(index)
    if (!result.owner) {
      result.owner = {
        id: `owner-${String(index + 1).padStart(3, '0')}`,
        name: `业主${index + 1}`,
        link: `1380000${String(index + 1).padStart(4, '0')}`
      }
    }
    if (!result.org) {
      result.org = [
        {
          id: `org-${String(index + 1).padStart(3, '0')}`,
          name: `组织 ${index + 1}`
        }
      ]
    }
  }

  return result
}

const normalizePath = (rawUrl = '') => {
  const url = rawUrl.replace(/^https?:\/\/[^/]+/, '')
  const [pathname] = url.split('?')
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return cleanPath.replace(/^\/api(?=\/)/, '')
}

const getParams = (config: AxiosRequestConfig) => {
  const params: Record<string, any> = { ...(config.params || {}) }
  if (config.url?.includes('?')) {
    const queryString = config.url.split('?')[1]
    new URLSearchParams(queryString).forEach((value, key) => {
      params[key] = value
    })
  }
  return params
}

const getRequestData = (config: AxiosRequestConfig) => {
  if (typeof config.data === 'string') {
    try {
      return JSON.parse(config.data)
    } catch {
      return {}
    }
  }
  return (config.data || {}) as MockRecord
}

const buildPage = (params: Record<string, any>, total: number) => ({
  num: String(params['page.num'] || 1),
  size: String(params['page.size'] || DEFAULT_PAGE_SIZE),
  total: String(total),
  disable: false
})

const createBaseRecord = (resourceName: string, index: number): MockRecord => {
  const suffix = String(index + 1).padStart(3, '0')
  return {
    id: `${resourceName}-${suffix}`,
    code: `${resourceName.toUpperCase().slice(0, 4)}${suffix}`,
    name: `${toTitle(resourceName)} ${index + 1}`,
    title: `${toTitle(resourceName)} 示例 ${index + 1}`,
    content: `${toTitle(resourceName)} 的模拟说明内容 ${index + 1}`,
    remark: '本地模拟数据，仅用于前端展示',
    seq: String(index + 1),
    sort: String(index + 1),
    type: String((index % 3) + 1),
    statusCd: index % 2 === 0 ? '0' : '1',
    state: index % 2 === 0 ? '1200' : '1100',
    amount: (index + 1) * 100,
    totalAmount: (index + 1) * 268,
    totalFee: (index + 1) * 120,
    payFee: (index + 1) * 80,
    address: `上海市示例路 ${index + 1} 号`,
    tel: `1380000${String(index + 1).padStart(4, '0')}`,
    photo: imagePlaceholder,
    url: imagePlaceholder,
    createdAt: nowString(index),
    updatedAt: nowString(index),
    startTime: nowString(index),
    endTime: nowString(index - 1),
    communityId: COMMUNITY_LIST[0].id,
    communityName: COMMUNITY_LIST[0].name,
    community: COMMUNITY_LIST[0].name,
    userName: `管理员${index + 1}`,
    ownerName: `业主${index + 1}`,
    ownerId: `owner-${suffix}`,
    roomNum: `${1 + (index % 8)}-${String(101 + index).padStart(3, '0')}`,
    floorNum: String(1 + (index % 18)),
    unitNum: String(1 + (index % 4)),
    buildingNum: `${1 + (index % 12)}栋`,
    carNum: `沪A${String(1000 + index).padStart(5, '0')}`,
    carBrand: ['特斯拉', '比亚迪', '大众', '宝马'][index % 4],
    carType: ['9901', '9902', '9903', '9904'][index % 4],
    carColor: ['白色', '黑色', '灰色', '蓝色'][index % 4],
    leaseType: ['H', 'S', 'I', 'NM'][index % 4],
    paId: `parking-area-${String((index % 4) + 1).padStart(3, '0')}`,
    psId: `parking-space-${suffix}`,
    parkingNum: `P-${String(100 + index).padStart(3, '0')}`,
    plateNum: `沪B${String(3000 + index).padStart(5, '0')}`,
    mobile: `1390000${String(index + 1).padStart(4, '0')}`,
    username: `user_${suffix}`,
    realName: `员工${index + 1}`,
    deptName: `部门${(index % 5) + 1}`,
    roleName: `角色${(index % 4) + 1}`,
    orgName: `组织${(index % 4) + 1}`,
    staffName: `维修员${index + 1}`,
    staffId: `staff-${suffix}`,
    planName: `巡检计划 ${index + 1}`,
    routeName: `巡检路线 ${index + 1}`,
    pointName: `巡检点 ${index + 1}`,
    itemName: `巡检项目 ${index + 1}`,
    supplierName: `供应商 ${index + 1}`,
    storehouseName: `仓库 ${index + 1}`,
    specificationName: `规格 ${index + 1}`,
    feeName: `费用项 ${index + 1}`,
    feeTypeName: `费用分类 ${index + 1}`,
    reportMonth: `2026-${String((index % 12) + 1).padStart(2, '0')}`,
    auditStatus: index % 2 === 0 ? '通过' : '待审',
    payStatus: index % 2 === 0 ? '已支付' : '未支付'
  }
}

const createResourceRecord = (resourceName: string, index: number): MockRecord => {
  const base = createBaseRecord(resourceName, index)

  if (resourceName === 'community') {
    return { ...COMMUNITY_LIST[index % COMMUNITY_LIST.length], id: `community-${String(index + 1).padStart(3, '0')}` }
  }

  if (resourceName === 'city_area') {
    return {
      id: `city-area-${index + 1}`,
      code: ['310000', '310100', '310115', '310112'][index % 4],
      name: ['上海市', '上海城区', '浦东新区', '闵行区'][index % 4],
      pId: index === 0 ? '0' : 'city-area-1',
      createdAt: nowString(index)
    }
  }

  if (resourceName.includes('owner')) {
    return {
      ...base,
      id: `owner-${String(index + 1).padStart(3, '0')}`,
      name: `业主${index + 1}`,
      sex: index % 2 === 0 ? '男' : '女',
      idCard: `31010119900${String(index + 1).padStart(6, '0')}`,
      roomNum: `${1 + (index % 6)}-${String(101 + index).padStart(3, '0')}`,
      address: `云栖花园 ${1 + (index % 6)} 幢 ${String(101 + index).padStart(3, '0')} 室`
    }
  }

  if (resourceName.includes('room')) {
    return {
      ...base,
      id: `room-${String(index + 1).padStart(3, '0')}`,
      roomNum: `${1 + (index % 8)}-${String(101 + index).padStart(3, '0')}`,
      unitNum: String(1 + (index % 4)),
      floorNum: String(1 + (index % 18)),
      builtUpArea: 86 + index,
      roomType: index % 2 === 0 ? '住宅' : '商铺',
      owner: {
        id: `owner-${String(index + 1).padStart(3, '0')}`,
        name: `业主${index + 1}`,
        link: `1380000${String(index + 1).padStart(4, '0')}`
      }
    }
  }

  if (resourceName.includes('floor')) {
    return {
      ...base,
      id: `floor-${String(index + 1).padStart(3, '0')}`,
      floorNum: String(1 + (index % 18)),
      layer: String(1 + (index % 18))
    }
  }

  if (resourceName.includes('unit')) {
    return {
      ...base,
      id: `unit-${String(index + 1).padStart(3, '0')}`,
      unitNum: String(1 + (index % 6)),
      buildingNum: `${1 + (index % 8)}栋`
    }
  }

  if (resourceName.includes('parking_area')) {
    return {
      ...base,
      id: `parking-area-${String(index + 1).padStart(3, '0')}`,
      num: `A${String(index + 1).padStart(2, '0')}`,
      areaNum: `A${String(index + 1).padStart(2, '0')}`,
      name: `停车区 ${String.fromCharCode(65 + (index % 5))}`,
      parkingType: index % 2 === 0 ? '地上' : '地下'
    }
  }

  if (resourceName.includes('parking_space_info')) {
    return {
      ...base,
      id: `parking-space-${String(index + 1).padStart(3, '0')}`,
      num: `P${String(100 + index)}`,
      psId: `parking-space-${String(index + 1).padStart(3, '0')}`,
      paId: `parking-area-${String((index % 4) + 1).padStart(3, '0')}`,
      areaNum: `A${String((index % 4) + 1).padStart(2, '0')}`,
      parkingType: index % 2 === 0 ? '1' : '2',
      state: index % 3 === 0 ? 'F' : 'S',
      parkingArea: {
        id: `parking-area-${String((index % 4) + 1).padStart(3, '0')}`,
        num: `A${String((index % 4) + 1).padStart(2, '0')}`,
        name: `停车区 ${String.fromCharCode(65 + (index % 4))}`
      }
    }
  }

  if (resourceName.includes('parking_box')) {
    return {
      ...base,
      id: `parking-box-${String(index + 1).padStart(3, '0')}`,
      num: `岗亭-${index + 1}`,
      name: `岗亭 ${index + 1}`,
      boxName: `岗亭 ${index + 1}`
    }
  }

  if (resourceName.includes('owner_car')) {
    return {
      ...base,
      id: `owner-car-${String(index + 1).padStart(3, '0')}`,
      psId: `parking-space-${String(index + 1).padStart(3, '0')}`,
      ownerId: `owner-${String(index + 1).padStart(3, '0')}`,
      ownerName: `业主${index + 1}`,
      carTypeCd: ['9901', '9902', '9903', '9904'][index % 4],
      parkingSpace: {
        id: `parking-space-${String(index + 1).padStart(3, '0')}`,
        num: `P${String(100 + index)}`
      },
      parkingSpaceInfo: {
        id: `parking-space-${String(index + 1).padStart(3, '0')}`,
        num: `P${String(100 + index)}`
      }
    }
  }

  if (resourceName.includes('car_inout')) {
    return {
      ...base,
      id: `car-inout-${String(index + 1).padStart(3, '0')}`,
      inTime: nowString(index + 1),
      outTime: nowString(index),
      inoutFee: 8 + index,
      parkingNum: `P${String(100 + index)}`
    }
  }

  if (resourceName.includes('remaining_parking_space')) {
    return {
      ...base,
      id: `remaining-${String(index + 1).padStart(3, '0')}`,
      areaName: `停车区 ${String.fromCharCode(65 + (index % 4))}`,
      totalNum: 120,
      usedNum: 60 + index,
      remainNum: 60 - index
    }
  }

  if (resourceName.includes('organization') || resourceName === 'org_user') {
    return {
      ...base,
      id: `org-${String(index + 1).padStart(3, '0')}`,
      name: `组织 ${index + 1}`,
      orgId: `org-${String(index + 1).padStart(3, '0')}`,
      pId: index < 3 ? '0' : `org-${String((index % 3) + 1).padStart(3, '0')}`,
      org: [
        {
          id: `org-${String((index % 3) + 1).padStart(3, '0')}`,
          name: `组织 ${(index % 3) + 1}`
        }
      ]
    }
  }

  if (resourceName.includes('employee') || resourceName === 'user') {
    return {
      ...base,
      id: `employee-${String(index + 1).padStart(3, '0')}`,
      username: `employee_${index + 1}`,
      name: `员工${index + 1}`,
      roleName: `角色${(index % 4) + 1}`,
      org: [
        {
          id: `org-${String((index % 3) + 1).padStart(3, '0')}`,
          name: `组织 ${(index % 3) + 1}`
        }
      ]
    }
  }

  if (resourceName.includes('role')) {
    return {
      ...base,
      id: `role-${String(index + 1).padStart(3, '0')}`,
      name: `角色 ${index + 1}`,
      code: `ROLE_${index + 1}`
    }
  }

  if (resourceName.includes('repair_setting')) {
    return {
      ...base,
      id: `repair-setting-${String(index + 1).padStart(3, '0')}`,
      name: `报修类型 ${index + 1}`,
      price: 50 + index,
      timeout: 30 + index
    }
  }

  if (resourceName.includes('repair_staff') || resourceName === 'staff') {
    return {
      ...base,
      id: `repair-staff-${String(index + 1).padStart(3, '0')}`,
      staffId: `staff-${String(index + 1).padStart(3, '0')}`,
      staffName: `维修师傅 ${index + 1}`,
      mobile: `1360000${String(index + 1).padStart(4, '0')}`
    }
  }

  if (resourceName.includes('repair_pool')) {
    return {
      ...base,
      id: `repair-${String(index + 1).padStart(3, '0')}`,
      repairType: `报修分类 ${(index % 5) + 1}`,
      repairName: `报修工单 ${index + 1}`,
      state: ['1000', '1100', '1200', '1300'][index % 4],
      ownerName: `报修人${index + 1}`,
      mobile: `1370000${String(index + 1).padStart(4, '0')}`
    }
  }

  if (resourceName.includes('spection') || resourceName.includes('inspection')) {
    return {
      ...base,
      id: `${resourceName}-${String(index + 1).padStart(3, '0')}`,
      name: `巡检项 ${index + 1}`,
      planName: `巡检计划 ${index + 1}`,
      routeName: `路线 ${index + 1}`,
      pointName: `点位 ${index + 1}`,
      itemName: `项目 ${index + 1}`,
      spectionPoint: {
        id: `spection-point-${String(index + 1).padStart(3, '0')}`,
        inspectionName: `巡检点名称 ${index + 1}`,
        pointObjType: index % 2 === 0 ? 1001 : 2002
      },
      spectionRoute: {
        id: `spection-route-${String(index + 1).padStart(3, '0')}`,
        name: `巡检路线 ${index + 1}`
      }
    }
  }

  if (resourceName.includes('release') || resourceName.includes('announcement')) {
    return {
      ...base,
      id: `${resourceName}-${String(index + 1).padStart(3, '0')}`,
      title: `${resourceName.includes('announcement') ? '社区公示' : '放行申请'} ${index + 1}`,
      photo: imagePlaceholder,
      publisher: `管理员${index + 1}`,
      applyCompany: `申请单位${index + 1}`,
      applyPerson: `申请人${index + 1}`,
      applyTel: `1380000${String(index + 1).padStart(4, '0')}`,
      idCard: `31010119900${String(index + 1).padStart(6, '0')}`,
      passTime: nowString(index),
      releaseType: [fallbackReleaseType(index)],
      releaseRes: fallbackReleaseRes(index)
    }
  }

  if (resourceName.includes('invoice')) {
    return {
      ...base,
      id: `${resourceName}-${String(index + 1).padStart(3, '0')}`,
      invoiceCode: `INV${String(10000 + index)}`,
      invoiceAmount: 200 + index * 5
    }
  }

  if (resourceName.includes('supplier')) {
    return {
      ...base,
      id: `supplier-${String(index + 1).padStart(3, '0')}`,
      name: `供应商 ${index + 1}`,
      contactPerson: `联系人${index + 1}`
    }
  }

  if (resourceName.includes('storehouse')) {
    return {
      ...base,
      id: `storehouse-${String(index + 1).padStart(3, '0')}`,
      name: `仓库 ${index + 1}`,
      address: `仓储路 ${index + 1} 号`
    }
  }

  if (
    resourceName.includes('resource_store') ||
    resourceName.includes('procurement') ||
    resourceName.includes('allocation_storehouse_apply') ||
    resourceName.includes('business_purchase_apply') ||
    resourceName.includes('purchase_apply_detail')
  ) {
    return {
      ...base,
      id: `${resourceName}-${String(index + 1).padStart(3, '0')}`,
      resName: `物资 ${index + 1}`,
      resCode: `RS${String(index + 1).padStart(3, '0')}`,
      stock: String(20 + index),
      price: 120 + index * 8,
      procurementResourceStore: [
        {
          id: `prs-${String(index + 1).padStart(3, '0')}-1`,
          quantity: 2 + index,
          price: 120 + index * 8,
          totalPrice: (2 + index) * (120 + index * 8),
          resourceStore: {
            id: `resource-store-${String(index + 1).padStart(3, '0')}`,
            resName: `物资 ${index + 1}`,
            resCode: `RS${String(index + 1).padStart(3, '0')}`
          }
        },
        {
          id: `prs-${String(index + 1).padStart(3, '0')}-2`,
          quantity: 1,
          price: 80 + index * 5,
          totalPrice: 80 + index * 5,
          resourceStore: {
            id: `resource-store-${String(index + 5).padStart(3, '0')}`,
            resName: `辅料 ${index + 1}`,
            resCode: `FL${String(index + 1).padStart(3, '0')}`
          }
        }
      ],
      parkingSpace: {
        id: `parking-space-${String(index + 1).padStart(3, '0')}`,
        num: `P${String(100 + index)}`
      },
      storehouse: {
        id: `storehouse-${String(index + 1).padStart(3, '0')}`,
        name: `仓库 ${index + 1}`
      }
    }
  }

  if (resourceName.includes('report') || resourceName.includes('query')) {
    return {
      ...base,
      id: `report-${String(index + 1).padStart(3, '0')}`,
      reportMonth: `2026-${String((index % 12) + 1).padStart(2, '0')}`,
      shouldAmount: 1000 + index * 50,
      realAmount: 800 + index * 40,
      rate: `${90 - index}%`
    }
  }

  return base
}

const seedResource = (resourcePath: string) => {
  const resourceName = resourcePath.split('/').filter(Boolean).pop() || 'resource'

  if (resourceName === 'community') {
    return COMMUNITY_LIST.map((item, index) => ({
      ...item,
      id: `community-${String(index + 1).padStart(3, '0')}`
    }))
  }

  return Array.from({ length: 4 }, (_, index) => createResourceRecord(resourceName, index))
}

const getCollection = (resourcePath: string) => {
  if (!database.has(resourcePath)) {
    database.set(resourcePath, seedResource(resourcePath))
  }
  return database.get(resourcePath)!
}

const flattenMenus = (menus: MockRecord[]) =>
  menus.flatMap(menu => {
    const children = Array.isArray(menu.children) ? menu.children : []
    return [{ ...menu, children: undefined }, ...children]
  })

const filterRows = (rows: MockRecord[], params: Record<string, any>) => {
  const ignoredKeys = new Set(['page.num', 'page.size', '_t', 'communityId', 'isExport', 'page.disable'])

  const filtered = rows.filter(row =>
    Object.entries(params).every(([key, value]) => {
      if (ignoredKeys.has(key) || value === '' || value === undefined || value === null) {
        return true
      }
      const normalizedKey = key.replace(/\./g, '')
      const candidates = [row[key], row[normalizedKey], row[key.replace(/([A-Z])/g, '_$1').toLowerCase()]]
      return candidates.some(candidate =>
        String(candidate ?? '')
          .toLowerCase()
          .includes(String(value).toLowerCase())
      )
    })
  )

  // 页面展示优先，筛选不到时退回原始数据，避免出现空表格。
  return filtered.length > 0 ? filtered : rows
}

const paginateRows = (rows: MockRecord[], params: Record<string, any>) => {
  const num = Number(params['page.num'] || 1)
  const size = Number(params['page.size'] || DEFAULT_PAGE_SIZE)
  const start = (num - 1) * size
  return rows.slice(start, start + size)
}

const getResourcePath = (method: HttpMethod, path: string) => {
  const segments = path.split('/').filter(Boolean)
  if (segments.length <= 2) {
    return path
  }
  if (method === 'post') {
    return `/${segments.slice(0, 2).join('/')}`
  }
  return `/${segments.slice(0, 2).join('/')}`
}

const getResourceId = (path: string) => {
  const segments = path.split('/').filter(Boolean)
  return segments.length > 2 ? segments[2] : ''
}

const buildResponse = <T>(config: AxiosRequestConfig, data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config
})

const mockUserInfo = () => ({
  id: 'mock-user-001',
  username: 'plate_super',
  code: 'plate_super',
  platform: '0',
  permission: {
    resources: ['*'],
    menus: ['*'],
    btns: ['*']
  },
  community: COMMUNITY_LIST
})

export const isMockEnabled = () => {
  if (typeof window === 'undefined') {
    return false
  }
  return window.localStorage.getItem('zenwell_use_mock') !== '0'
}

export const mockRequest = async <T>(
  method: HttpMethod,
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const path = normalizePath(config.url)
  const params = getParams(config)
  const body = getRequestData(config)

  if (path === '/auth/login' || path === '/auth/login_to') {
    return buildResponse(config, {
      token: 'mock-token-zenwell',
      refreshToken: 'mock-refresh-token',
      expiresIn: 7200
    } as T)
  }

  if (path === '/auth/info') {
    return buildResponse(config, mockUserInfo() as T)
  }

  if (path === '/auth/city_area') {
    const list = seedResource('/auth/city_area')
    return buildResponse(
      config,
      {
        page: buildPage(params, list.length),
        list: paginateRows(list, params)
      } as T
    )
  }

  if (path === '/auth/actions') {
    return buildResponse(config, { list: MENU_TREE } as T)
  }

  if (path === '/auth/action') {
    const list = flattenMenus(MENU_TREE)
    return buildResponse(
      config,
      {
        page: buildPage(params, list.length),
        list: paginateRows(list, params)
      } as T
    )
  }

  if (path === '/file/uploads') {
    return buildResponse(config, { url: imagePlaceholder } as T)
  }

  const resourcePath = getResourcePath(method, path)
  const resourceId = getResourceId(path)
  const collection = getCollection(resourcePath)

  if (method === 'get') {
    if (resourceId) {
      const detail = collection.find(item => item.id === resourceId) || {
        ...createResourceRecord(resourcePath.split('/').pop() || 'resource', 0),
        id: resourceId
      }
      return buildResponse(config, ensureDisplayData(detail, 0) as T)
    }

    const filtered = filterRows(collection, params)
    return buildResponse(
      config,
      {
        page: buildPage(params, filtered.length),
        list: paginateRows(filtered, params).map((item, index) => ensureDisplayData(item, index)),
        exportUrl: imagePlaceholder
      } as T
    )
  }

  if (method === 'post') {
    const resourceName = resourcePath.split('/').pop() || 'resource'
    const created: MockRecord = {
      ...createResourceRecord(resourceName, collection.length),
      ...body,
      id: body.id || `${resourceName}-${String(Date.now())}`
    }
    collection.unshift(created)
    database.set(resourcePath, collection)
    return buildResponse(config, ensureDisplayData(created, 0) as T)
  }

  if (method === 'patch') {
    const nextCollection = collection.map(item =>
      item.id === resourceId ? { ...item, ...body, id: resourceId } : item
    )
    database.set(resourcePath, nextCollection)
    const updated = nextCollection.find(item => item.id === resourceId) || body
    return buildResponse(config, ensureDisplayData(updated, 0) as T)
  }

  if (method === 'delete') {
    const ids = resourceId.split(',').filter(Boolean)
    const nextCollection = collection.filter(item => !ids.includes(String(item.id)))
    database.set(resourcePath, nextCollection)
    return buildResponse(config, { success: true, ids } as T)
  }

  return buildResponse(config, {} as T)
}
