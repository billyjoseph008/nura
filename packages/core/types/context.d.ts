export type ContextAction = {
  type: 'open' | 'delete' | string
  target: string
  payload?: any
}

export declare class ContextManager {
  private last: ContextAction | null
  save(action: ContextAction): void
  getLast(): ContextAction | null
  maybeConfirm(utter: string): ContextAction | null
}
