import { compareWakeWord, type MatchResult } from '@nura/plugin-fuzzy'

import type { WakeWordConfig, WakeWordInput } from './types'

type WakeEntry = {
  canonical: string
  aliases: string[]
  minConfidence: number
}

type WakeDetection = {
  matched: boolean
  result: MatchResult | null
  entry?: WakeEntry
}

const DEFAULT_CONFIDENCE = 0.75
const FILLER_WORDS = new Set(['ok', 'oye', 'hey', 'hola', 'eh', 'ey'])

export function normalizeWakeWords(inputs: WakeWordInput[] | undefined): WakeEntry[] {
  if (!inputs || inputs.length === 0) return []
  return inputs.map((item) => {
    if (typeof item === 'string') {
      const trimmed = item.trim()
      const tokens = trimmed.split(/\s+/)
      const aliases = tokens.length > 1 ? [tokens[tokens.length - 1]] : []
      return {
        canonical: trimmed,
        aliases,
        minConfidence: DEFAULT_CONFIDENCE,
      }
    }
    const config: WakeWordConfig = item
    return {
      canonical: config.canonical,
      aliases: config.aliases ?? [],
      minConfidence: config.minConfidence ?? DEFAULT_CONFIDENCE,
    }
  })
}

export function detectWake(
  input: string,
  entries: WakeEntry[],
  locale: 'es' | 'en',
): WakeDetection {
  if (entries.length === 0) return { matched: true, result: null }
  let best: { entry: WakeEntry; result: MatchResult } | null = null
  for (const entry of entries) {
    const result = compareWakeWord(input, entry, {
      locale,
      minConfidence: entry.minConfidence,
      strategy: 'hybrid',
      maxCandidates: 3,
    })
    if (result && result.score >= entry.minConfidence) {
      if (!best || result.score > best.result.score) {
        best = { entry, result }
      }
    }
  }
  if (!best) return { matched: false, result: null }
  return { matched: true, result: best.result, entry: best.entry }
}

export function stripWake(input: string, result: MatchResult | null): string {
  if (!result || !result.matchedTokens || result.matchedTokens.length === 0) {
    return input.trim()
  }
  const tokens = tokenizeWithOffsets(input)
  const matched = result.matchedTokens[0]
  const idx = matched.index ?? tokens.findIndex((t) => t.token.toLowerCase() === matched.token)
  if (idx == null || idx < 0 || !tokens[idx]) return input.trim()
  let start = tokens[idx]!.start
  let end = tokens[idx]!.end
  if (idx > 0) {
    const prev = tokens[idx - 1]!
    if (isFiller(prev.token)) {
      start = prev.start
    }
  }
  const before = input.slice(0, start).trim()
  const after = input.slice(end).trim()
  return [before, after].filter(Boolean).join(' ').trim()
}

function tokenizeWithOffsets(input: string): Array<{ token: string; start: number; end: number }> {
  const result: Array<{ token: string; start: number; end: number }> = []
  const regex = /[^\s]+/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(input)) !== null) {
    result.push({ token: match[0]!, start: match.index, end: match.index + match[0]!.length })
  }
  return result
}

function isFiller(token: string): boolean {
  return FILLER_WORDS.has(token.toLowerCase())
}
