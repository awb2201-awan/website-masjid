import {useEffect, useState} from 'react'

export function useSanityData(url, fallback) {
  const [data, setData] = useState(fallback)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`${url} returned ${response.status}`)
        return response.json()
      })
      .then((items) => {
        if (!active) return
        if (Array.isArray(items) && items.length > 0) setData(items)
        setStatus('ready')
      })
      .catch((error) => {
        if (!active) return
        console.error(`Failed to load ${url}`, error)
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [url])

  return {data, isLoading: status === 'loading', hasError: status === 'error'}
}
