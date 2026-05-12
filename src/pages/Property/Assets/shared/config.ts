export interface AssetPageConfig {
  title: string
  routePath: string
  endpoint: string
  description: string
  highlights: string[]
}

export const assetPageConfigs: Record<string, AssetPageConfig> = {
  assetPortal: {
    title: '资产门户',
    routePath: '/assets/AssetPortal',
    endpoint: '/auth/asset_portal',
    description: '集中展示资产总览、待办事项、风险预警和快捷入口，形成资产统一可视化工作台。',
    highlights: ['统一总览', '待办聚合', '风险预警', '快捷入口']
  },
  assetManagement: {
    title: '资产管理',
    routePath: '/assets/AssetManagement',
    endpoint: '/auth/asset_management',
    description: '建立统一资产总台账，沉淀资产主数据、权属信息、使用状态和全生命周期档案。',
    highlights: ['统一台账', '主数据档案', '状态跟踪', '生命周期管理']
  },
  assetCard: {
    title: '资产卡片',
    routePath: '/assets/AssetCard',
    endpoint: '/auth/asset_card',
    description: '以电子卡片形式集中管理资产基础信息、权属资料、技术参数和台账记录。',
    highlights: ['一卡一档', '参数沉淀', '权属留存', '信息归集']
  },
  assetOperation: {
    title: '资产经营',
    routePath: '/assets/AssetOperation',
    endpoint: '/auth/asset_operation',
    description: '支持经营性资产的租赁、收益核算、经营分析和合同关联，形成价值化运营视图。',
    highlights: ['租赁经营', '收益核算', '经营分析', '合同关联']
  },
  assetDepreciation: {
    title: '资产折旧',
    routePath: '/assets/AssetDepreciation',
    endpoint: '/auth/asset_depreciation',
    description: '按折旧规则自动计提，输出折旧台账、周期记录和财务同步占位数据。',
    highlights: ['自动计提', '折旧台账', '规则配置', '财务同步']
  },
  assetDisposal: {
    title: '资产处置',
    routePath: '/assets/AssetDisposal',
    endpoint: '/auth/asset_disposal',
    description: '规范报废、出售、转让、残值核算与销账流程，形成可追溯处置闭环。',
    highlights: ['报废出售', '处置审批', '残值核算', '销账归档']
  },
  assetVoucher: {
    title: '资产凭证',
    routePath: '/assets/AssetVoucher',
    endpoint: '/auth/asset_voucher',
    description: '汇总资产业务凭证数据，预留与财务系统对接的凭证生成与核算映射能力。',
    highlights: ['凭证生成', '核算映射', '财务联动', '会计留痕']
  },
  assetSharing: {
    title: '资产共享',
    routePath: '/assets/AssetSharing',
    endpoint: '/auth/asset_sharing',
    description: '建设共享资产池，支持跨部门调配、共享审批、使用统计和闲置复用。',
    highlights: ['共享池', '跨部门复用', '审批流转', '利用率提升']
  },
  assetWarning: {
    title: '资产预警',
    routePath: '/assets/AssetWarning',
    endpoint: '/auth/asset_warning',
    description: '对维保到期、折旧到期、闲置超期和处置逾期等关键节点进行统一预警。',
    highlights: ['到期提醒', '闲置预警', '处置催办', '风险聚合']
  },
  assetSupervision: {
    title: '资产监管',
    routePath: '/assets/AssetSupervision',
    endpoint: '/auth/asset_supervision',
    description: '面向监管与审计场景输出资产上报、合规校验、风险核查和监管视图。',
    highlights: ['监管上报', '合规校验', '风险核查', '审计留痕']
  },
  intangibleAsset: {
    title: '无形资产',
    routePath: '/assets/IntangibleAsset',
    endpoint: '/auth/intangible_asset',
    description: '管理专利、软件、知识产权等无形资产，支撑摊销、权属维护和档案留存。',
    highlights: ['知识产权', '摊销管理', '权属维护', '档案留存']
  },
  mobileAsset: {
    title: '移动端应用',
    routePath: '/assets/MobileAsset',
    endpoint: '/auth/mobile_asset',
    description: '展示移动端资产查看、审批、处置与盘点能力，作为后补移动资产业务入口。',
    highlights: ['移动查看', '审批处理', '扫码盘点', '移动处置']
  }
}
