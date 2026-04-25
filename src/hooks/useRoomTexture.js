import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * Loads an equirectangular JPG for the inner sphere; disposes previous textures on change/unmount.
 */
function preloadImageUrls(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return () => {}
  const loaders = urls
    .filter((url) => typeof url === 'string' && url.length > 0)
    .map((url) => {
      const img = new Image()
      img.loading = 'eager'
      img.decoding = 'async'
      img.src = url
      return img
    })
  return () => {
    loaders.forEach((img) => {
      img.src = ''
    })
  }
}

export function useRoomTexture(imageUrl, preloadUrls = []) {
  const [texture, setTexture] = useState(null)
  const [cubeTexture, setCubeTexture] = useState(null)
  const [loading, setLoading] = useState(true)
  const requestIdRef = useRef(0)

  useEffect(() => {
    requestIdRef.current += 1
    const requestId = requestIdRef.current
    let cancelled = false
    let loadedTexture = null
    let loadedCubeTexture = null

    setLoading(true)
    setTexture((prev) => {
      if (prev) prev.dispose()
      return null
    })
    setCubeTexture((prev) => {
      if (prev) prev.dispose()
      return null
    })

    if (imageUrl && typeof imageUrl === 'object' && imageUrl.type === 'cubefaces') {
      const cubeLoader = new THREE.CubeTextureLoader()
      // Panotour order is FRBLUD, while CubeTextureLoader expects:
      // [px, nx, py, ny, pz, nz] => [right, left, up, down, front, back].
      const orderedFaces = [
        imageUrl.faces[1], // right
        imageUrl.faces[3], // left
        imageUrl.faces[4], // up
        imageUrl.faces[5], // down
        imageUrl.faces[0], // front
        imageUrl.faces[2], // back
      ]
      cubeLoader.load(
        orderedFaces,
        (cubeTex) => {
          if (cancelled || requestId !== requestIdRef.current) {
            cubeTex.dispose()
            return
          }
          cubeTex.colorSpace = THREE.SRGBColorSpace
          loadedCubeTexture = cubeTex
          setCubeTexture(cubeTex)
          setLoading(false)
        },
        undefined,
        (err) => {
          if (cancelled || requestId !== requestIdRef.current) return
          console.warn('[VR Hotel] Failed to load cube panorama:', imageUrl, err)
          setLoading(false)
        },
      )
    } else {
      const loader = new THREE.TextureLoader()
      loader.load(
        imageUrl,
        (tex) => {
          if (cancelled || requestId !== requestIdRef.current) {
            tex.dispose()
            return
          }
          tex.colorSpace = THREE.SRGBColorSpace
          tex.anisotropy = 4
          loadedTexture = tex
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
    }

    return () => {
      cancelled = true
      if (loadedTexture) {
        loadedTexture.dispose()
        loadedTexture = null
      }
      if (loadedCubeTexture) {
        loadedCubeTexture.dispose()
        loadedCubeTexture = null
      }
    }
  }, [imageUrl])

  useEffect(() => {
    const cleanup = preloadImageUrls(preloadUrls)
    return cleanup
  }, [preloadUrls])

  return { texture, cubeTexture, loading }
}
