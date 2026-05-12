import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const AssetWarningIndex = () => <AssetModulePage config={assetPageConfigs.assetWarning} />

export default memo(AssetWarningIndex)
