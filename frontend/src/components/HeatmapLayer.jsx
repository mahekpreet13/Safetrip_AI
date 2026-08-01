import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import 'leaflet.heat'
import L from 'leaflet'

export default function HeatmapLayer({ points = [] }) {
  const map = useMap()

  useEffect(() => {
    if (!points || points.length === 0) return

    const heatPoints = points.map((p) => [p.lat, p.lng, p.weight || 1])

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 20,
      maxZoom: 15,
      gradient: {
        0.2: 'green',
        0.5: 'yellow',
        0.8: 'red',
      },
    })

    heatLayer.addTo(map)

    // Clean up the old layer whenever points change or the component unmounts,
    // otherwise old heat layers stack up on top of each other on every search
    return () => {
      map.removeLayer(heatLayer)
    }
  }, [points, map])

  return null
}