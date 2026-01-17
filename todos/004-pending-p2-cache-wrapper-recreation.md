---
status: pending
priority: p2
issue_id: "004"
tags: [code-review, performance]
dependencies: []
---

# Optimize Cache Wrapper to Avoid Recreation

## Problem Statement

The `_getCachedMessages` function wrapper is recreated on every call to `getMessagesByChatId`. This is inefficient and could cause unnecessary overhead.

## Findings

- Location: `lib/db/queries.ts` around the cache implementation
- Current pattern creates new `unstable_cache` wrapper each invocation
- Should be created once at module level

**Current (inefficient):**
```typescript
export async function getMessagesByChatId({ id }) {
  const cached = unstable_cache(
    async () => { /* query */ },
    [`messages-${id}`],
    { tags: [`messages-${id}`], revalidate: 10 }
  );
  return cached();
}
```

**Optimal:**
```typescript
const _getCachedMessages = unstable_cache(
  async (id: string) => { /* query */ },
  ["messages"],
  { tags: ["messages"], revalidate: 10 }
);

export async function getMessagesByChatId({ id }) {
  return _getCachedMessages(id);
}
```

## Proposed Solutions

### Option 1: Module-Level Cache Wrapper

**Approach:** Move cache wrapper creation to module level.

**Pros:**
- Single wrapper instance
- More efficient
- Proper cache key handling

**Cons:**
- Need to handle dynamic tags differently
- Minor refactor

**Effort:** 30 minutes

**Risk:** Low

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**
- `lib/db/queries.ts` - cache wrapper location

## Acceptance Criteria

- [ ] Cache wrapper created once at module level
- [ ] Dynamic cache keys still work correctly
- [ ] Performance improvement measurable

## Work Log

### 2026-01-18 - Initial Discovery

**By:** Claude Code (workflows:review - performance-oracle)

**Actions:**
- Identified cache wrapper recreation issue
- Drafted optimization approach
