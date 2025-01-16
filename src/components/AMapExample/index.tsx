import React, { useEffect } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'

const AMapExample = () => {
  useEffect(() => {
    AMapLoader.load({
      key: 'e3c3c3bd0abf93af95edf02b7d2f24fe', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [] //插件列表
    })
      .then(AMap => {
        let amap = new AMap.Map('mapContainer', {
          // mapcontainer为容器的id
          zoom: 15, //初始化地图层级
          center: [112.5266, 27.91507] //初始化地图中心点
        })
        // 标记
        let marker = new AMap.Marker({
          position: [112.5266, 27.91507] // 基点位置
        })
        // 地图添加标记
        amap.add(marker)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  return <div id="mapContainer" style={{ width: '100%', height: '400px' }}></div>
}

export default AMapExample
