import '@nura/core'

// Augment @nura/core metadata typings so plugin-voice can access requireConfirm safely.
declare module '@nura/core' {
  interface NActionMeta {
    /**
     * Whether an action requires explicit confirmation before execution.
     * This flag is optionally interpreted by adapters such as plugin-voice.
     */
    requireConfirm?: boolean;
  }
}

export {}
