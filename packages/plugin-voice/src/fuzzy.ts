/** Damerau–Levenshtein distance (tolerancia a transposición) */
export function damerauLevenshtein(a: string, b: string): number {
  const lenA = a.length
  const lenB = b.length
  const dist: number[][] = Array.from({ length: lenA + 2 }, () =>
    new Array(lenB + 2).fill(0),
  )

  const maxDist = lenA + lenB
  dist[0][0] = maxDist
  for (let i = 0; i <= lenA; i++) {
    dist[i + 1][0] = maxDist
    dist[i + 1][1] = i
  }
  for (let j = 0; j <= lenB; j++) {
    dist[0][j + 1] = maxDist
    dist[1][j + 1] = j
  }

  const da: Record<string, number> = {}
  for (let i = 1; i <= lenA; i++) {
    let db = 0
    for (let j = 1; j <= lenB; j++) {
      const i1 = da[b[j - 1]] ?? 0
      const j1 = db
      let cost = 1
      if (a[i - 1] === b[j - 1]) {
        cost = 0
        db = j
      }
      dist[i + 1][j + 1] = Math.min(
        dist[i][j] + cost, // substitution
        dist[i + 1][j] + 1, // insertion
        dist[i][j + 1] + 1, // deletion
        dist[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1), // transposition
      )
    }
    da[a[i - 1]] = i
  }
  return dist[lenA + 1][lenB + 1]
}

/** Similaridad normalizada (1.0 = idéntico) */
export function similarity(a: string, b: string): number {
  if (!a || !b) return 0
  const d = damerauLevenshtein(a.toLowerCase(), b.toLowerCase())
  const maxLen = Math.max(a.length, b.length)
  return maxLen === 0 ? 1 : 1 - d / maxLen
}
