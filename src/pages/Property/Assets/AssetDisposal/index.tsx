import { memo } from 'react'
import AssetModulePage from '../shared/AssetModulePage'
import { assetPageConfigs } from '../shared/config'

const AssetDisposalIndex = () => <AssetModulePage config={assetPageConfigs.assetDisposal} />

export default memo(AssetDisposalIndex)
