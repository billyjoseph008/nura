import type { NAction, NActionSpec, NContext, NEntityDef, NLocale } from '@nura/core'

export type NIntent = {
  name: string
  match: RegExp | ((utterance: string) => NAction | null)
  toAction?: (m: RegExpMatchArray) => NAction | null
  locale?: NLocale
  phrase?: string
  normalizedPhrase?: string
  entities?: NEntityDef[]
  confidenceThreshold?: number
  tokens?: string[]
  entitySynonyms?: Record<string, string[]>
  sourceSpec?: NActionSpec
}

export interface WakeWordConfig {
  canonical: string
  aliases?: string[]
  minConfidence?: number
}

export type WakeWordInput = string | WakeWordConfig

export type NVoiceOptions = {
  wakeWords?: WakeWordInput[]
  intents?: NIntent[]
  language?: string
  keyWake?: string
  autoStart?: boolean
  devMode?: boolean
}

export type MatchPipelineOpts = {
  fuzzy?: boolean
  threshold?: number
  wakeConfidence?: number
  wakeVia?: 'exact' | 'phonetic' | 'edit' | 'none'
  devMode?: boolean
}

export type TokenComparison = {
  token: string
  best: string
  score: number
  via: 'exact' | 'phonetic' | 'edit'
}

export type RankedIntent = {
  intentId: string
  score: number
  via: 'exact' | 'phonetic' | 'global'
}

export type RankDebugEvent = {
  input: string
  topK: RankedIntent[]
  tokensCompared: TokenComparison[]
  entitiesParsed: Record<string, unknown>
}

export type IntentMatchResult = {
  action: NAction
  score: number
  via: 'exact' | 'phonetic' | 'global'
  tokensCompared: TokenComparison[]
  entitiesParsed: Record<string, unknown>
}

export type VoiceAgentContext = {
  ctx: NContext
  options: NVoiceOptions
}
