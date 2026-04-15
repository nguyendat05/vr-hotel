import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * Loads an equirectangular JPG for the inner sphere; disposes previous textures on change/unmount.
 */
export function useRoomTexture(imageUrl) {
  const [texture, setTexture] = useState(null)
  const [loading, setLoading] = useState(true)
  const requestIdRef = useRef(0)

  useEffect(() => {
    requestIdRef.current += 1
    const requestId = requestIdRef.current
    let cancelled = false
    let loaded = null
    const loader = new THREE.TextureLoader()

    setLoading(true)
    setTexture((prev) => {
      if (prev) prev.dispose()
      return null
    })

    loader.load(
      imageUrl,
      (tex) => {
        if (cancelled || requestId !== requestIdRef.current) {
          tex.dispose()
          return
        }
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        loaded = tex
        setTexture(tex)
        setLoading(false)
      },
      undefined,
      (err) => {
        if (cancelled || requestId !== requestIdRef.current) return
        console.warn('[VR Hotel] Failed to load panorama texture:', imageUrl, err)
        setLoading(false)
      },
    )

    return () => {
      cancelled = true
      if (loaded) {
        loaded.dispose()
        loaded = null
      }
    }
  }, [imageUrl])

  return { texture, loading }
}
