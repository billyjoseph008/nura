---
title: Nura.js — Agent ↔ UI Framework
description: Nura.js is an open toolkit for ergonomic agent and UI collaboration across web stacks.
layout: home
hero:
  name: Nura.js
  text: Cohesive tooling for intent-driven interfaces across React, Vue, and Svelte.
  tagline: Model agent expectations, surface UI affordances, and keep both in sync.
  image:
    src: /assets/nura-logo.svg
    alt: Nura.js logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: GitHub →
      link: https://github.com/nura-dev/nura
features:
  - title: Intent aware
    details: Describe commands and permissions in one place so your agent layer stays predictable.
  - title: Framework agnostic
    details: Use Vue, React, or Svelte adapters backed by the same core primitives.
  - title: Developer focused
    details: Type-safe APIs, utilities for wake words and numerals, and docs tuned for shipping product.
  - title: Release ready
    details: Verification scripts, accessibility-first defaults, and guidance for secure deployments.
sections:
  - title: Quick Start
    text: "```ts\nimport { stripWake } from '@nura/core/wake'\nstripWake('hey nura open settings')\n```"
    link: /guide/getting-started
  - title: Explore recipes
    text: Browse practical examples for wake words, contextual confirmations, and UI adapters.
    link: /tutorials/recipes
  - title: API Reference
    text: Search the generated TypeDoc reference for every helper exposed by the Nura packages.
    link: /api/
---

# Welcome to Nura.js

Nura.js helps you ship agent-aware interfaces that behave consistently across web frameworks. Use the guides, tutorials, and API
reference to connect your UI with voice, fuzzy matching, and contextual confirmations.
