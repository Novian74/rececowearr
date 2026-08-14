/**
 * Image URL Resolver Helper
 * Converts product image names (e.g. 'c001', 'C023 (banyak warna)', 'baju-strip') 
 * into full static paths (/images/products/c001.jpeg) while preserving 
 * static avatar logo paths like /images/logo.svg
 */
export function resolveImageUrl(input: string | null | undefined): string {
  if (!input) return ''
  const trimmed = input.trim()
  if (!trimmed) return ''

  // If full URL, Data URL, or already starts with /images/ or /uploads/
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('/images/') ||
    trimmed.startsWith('/uploads/')
  ) {
    return trimmed
  }

  // Strip leading slash if any
  let cleanName = trimmed.replace(/^\/+/, '')

  // If user entered 'images/...'
  if (cleanName.startsWith('images/')) {
    return `/${cleanName}`
  }

  // Default: product image filename (e.g. 'c001', 'sp001', 'baju-strip')
  const hasExtension = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanName)
  if (!hasExtension) {
    cleanName = `${cleanName}.jpeg`
  }

  return `/images/products/${cleanName}`
}

/**
 * Handle Image Loading Fallbacks on the client side
 * Fuzzy / Case-Insensitive fallback matching:
 * 1. Tries exact filename lowercase (c023.jpeg)
 * 2. Tries exact filename uppercase (C023.jpeg)
 * 3. Tries extracted code token (e.g. C023 from 'C023 (banyak warna)')
 * 4. Tries alternative extensions (.jpeg <-> .jpg <-> .png)
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget
  const currentSrc = target.src
  const step = parseInt(target.dataset.fallbackStep || '0', 10)

  try {
    // Extract base path, filename, and extension
    const urlParts = currentSrc.split('/')
    const lastPart = urlParts.pop() || ''
    const basePath = urlParts.join('/')
    const filename = decodeURIComponent(lastPart)

    const extMatch = filename.match(/\.(jpeg|jpg|png|webp|gif|svg)$/i)
    const ext = extMatch ? extMatch[0].toLowerCase() : '.jpeg'
    const nameWithoutExt = filename.replace(/\.(jpeg|jpg|png|webp|gif|svg)$/i, '')

    // Extract first code token (e.g., "C023" from "C023 (banyak warna)")
    const codeToken = nameWithoutExt.split(/[\s_\-(]+/)[0] || nameWithoutExt

    if (step === 0) {
      target.dataset.fallbackStep = '1'
      // Step 1: Try exact filename in lowercase (e.g. c023.jpeg)
      target.src = `${basePath}/${encodeURIComponent(nameWithoutExt.toLowerCase())}${ext}`
    } else if (step === 1) {
      target.dataset.fallbackStep = '2'
      // Step 2: Try exact filename in uppercase (e.g. C023.jpeg)
      target.src = `${basePath}/${encodeURIComponent(nameWithoutExt.toUpperCase())}${ext}`
    } else if (step === 2) {
      target.dataset.fallbackStep = '3'
      // Step 3: Try code token only lowercase (e.g. c023.jpeg)
      if (codeToken && codeToken.toLowerCase() !== nameWithoutExt.toLowerCase()) {
        target.src = `${basePath}/${encodeURIComponent(codeToken.toLowerCase())}.jpeg`
      } else {
        // Try .jpg extension
        target.src = `${basePath}/${encodeURIComponent(nameWithoutExt.toLowerCase())}.jpg`
      }
    } else if (step === 3) {
      target.dataset.fallbackStep = '4'
      // Step 4: Try code token uppercase (e.g. C023.jpeg)
      target.src = `${basePath}/${encodeURIComponent(codeToken.toUpperCase())}.jpeg`
    } else if (step === 4) {
      target.dataset.fallbackStep = '5'
      // Step 5: Try code token lowercase with .jpg (e.g. c023.jpg)
      target.src = `${basePath}/${encodeURIComponent(codeToken.toLowerCase())}.jpg`
    } else if (step === 5) {
      target.dataset.fallbackStep = '6'
      // Step 6: Try code token uppercase with .jpg (e.g. C023.jpg)
      target.src = `${basePath}/${encodeURIComponent(codeToken.toUpperCase())}.jpg`
    } else if (step === 6) {
      target.dataset.fallbackStep = '7'
      // Step 7: Try code token lowercase with .png (e.g. c023.png)
      target.src = `${basePath}/${encodeURIComponent(codeToken.toLowerCase())}.png`
    } else if (step === 7) {
      target.dataset.fallbackStep = '8'
      // Step 8: Try code token uppercase with .png (e.g. C023.png)
      target.src = `${basePath}/${encodeURIComponent(codeToken.toUpperCase())}.png`
    }
  } catch (err) {
    console.error('Error handling fallback image:', err)
  }
}
