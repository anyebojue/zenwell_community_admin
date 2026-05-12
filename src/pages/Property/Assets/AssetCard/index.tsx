import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const AssetCardIndex = () => <AssetModulePage config={assetPageConfigs.assetCard} />

export default memo(AssetCardIndex)
