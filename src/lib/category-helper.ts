/**
 * Product Category Helper & Auto-Detector
 * Automatically categorizes products based on title/code prefixes:
 * - KM -> Kemeja
 * - AS -> Atasan
 * - BT -> Boots
 * - BL -> Blouse
 * - RK -> Rok
 * - ST -> Setelan
 * - CL -> Celana
 * - SP -> Sepatu
 * - TB -> Totebag
 * - C -> Cardigan
 * - K -> Kaos
 */

export const CATEGORIES = [
  'Semua',
  'Cardigan',
  'Sepatu',
  'Totebag',
  'Kaos',
  'Kemeja',
  'Setelan',
  'Celana',
  'Atasan',
  'Boots',
  'Blouse',
  'Rok',
] as const

export type CategoryName = (typeof CATEGORIES)[number]

export function detectCategory(title: string): CategoryName {
  if (!title) return 'Semua'
  const trimmed = title.trim()
  const upper = trimmed.toUpperCase()

  // 1. Check 2-letter prefixes & keywords
  if (upper.startsWith('KM') || upper.includes('KEMEJA')) {
    return 'Kemeja'
  }
  if (upper.startsWith('AS') || upper.includes('ATASAN') || upper.includes('TOPS') || upper.includes('TOP')) {
    return 'Atasan'
  }
  if (upper.startsWith('BT') || upper.includes('BOOTS') || upper.includes('BOOT')) {
    return 'Boots'
  }
  if (upper.startsWith('BL') || upper.includes('BLOUSE') || upper.includes('BLUS')) {
    return 'Blouse'
  }
  if (upper.startsWith('RK') || upper.includes('ROK') || upper.includes('SKIRT')) {
    return 'Rok'
  }
  if (upper.startsWith('ST') || upper.includes('SETELAN') || upper.includes('ONESEET') || upper.includes('ONE SET')) {
    return 'Setelan'
  }
  if (upper.startsWith('CL') || upper.includes('CELANA') || upper.includes('PANTS') || upper.includes('JEANS')) {
    return 'Celana'
  }
  if (upper.startsWith('SP') || upper.includes('SEPATU') || upper.includes('SHOES') || upper.includes('SNEAKERS')) {
    return 'Sepatu'
  }
  if (upper.startsWith('TB') || upper.includes('TOTEBAG') || upper.includes('TAS') || upper.includes('BAG')) {
    return 'Totebag'
  }

  // 2. Check 1-letter prefixes & keywords
  if (upper.startsWith('C') || upper.includes('CARDIGAN')) {
    return 'Cardigan'
  }
  if (upper.startsWith('K') || upper.includes('KAOS') || upper.includes('TEE')) {
    return 'Kaos'
  }

  return 'Semua'
}
