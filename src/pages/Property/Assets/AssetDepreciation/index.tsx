import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const AssetDepreciationIndex = () => <AssetModulePage config={assetPageConfigs.assetDepreciation} />

export default memo(AssetDepreciationIndex)
