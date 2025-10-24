import type { FuzzyMatchOpts } from '@nura/plugin-fuzzy'

export type CompareWakeWord = (
  input: string,
  wake: { canonical: string; aliases?: string[] },
  opts?: FuzzyMatchOpts,
) => { score: number; value?: string; strategy?: string } | null

export type StripWakeOptions = {
  aliases?: string[]
  minConfidence?: number
  compare?: (a: string, b: string) => number
  compareWakeWord?: CompareWakeWord | null
}

export declare const compareWakeWord: CompareWakeWord
export declare function stripWake(raw: string, opts?: StripWakeOptions): string
