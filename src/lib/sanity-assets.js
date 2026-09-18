const SANITY_ASSET_HOSTNAME = 'cdn.sanity.io'

export function trustedSanityAssetUrl(value, fallback = '') {
  if (!value) return fallback

  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === SANITY_ASSET_HOSTNAME ? value : fallback
  } catch {
    return fallback
  }
}
