import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const AssetSupervisionIndex = () => <AssetModulePage config={assetPageConfigs.assetSupervision} />

export default memo(AssetSupervisionIndex)
