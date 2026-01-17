---
status: pending
priority: p2
issue_id: "005"
tags: [code-review, reliability, error-handling]
dependencies: []
---

# Add JSON Parse Error Handling in API Routes

## Problem Statement

Several API routes call `await request.json()` without try-catch, which can throw if the request body is malformed JSON.

## Findings

- Routes affected:
  - `app/(chat)/api/reactions/route.ts:96`
  - `app/(chat)/api/reactions/route.ts:155`
  - `app/(chat)/api/vote/route.ts:52-57`
  - `app/(chat)/api/profile/route.ts:82`

**Current pattern:**
```typescript
const { messageId, reactionType } = await request.json();
// No error handling - throws on malformed JSON
```

## Proposed Solutions

### Option 1: Wrap in Try-Catch

**Approach:** Add try-catch around JSON parsing with proper error response.

```typescript
let body;
try {
  body = await request.json();
} catch {
  return new Response("Invalid JSON", { status: 400 });
}
```

**Pros:**
- Simple fix
- Clear error messages

**Cons:**
- Repetitive across routes

**Effort:** 30 minutes

**Risk:** Low

---

### Option 2: Create Safe JSON Parser Utility

**Approach:** Create reusable utility function.

```typescript
async function safeParseJson<T>(request: Request): Promise<{ data: T } | { error: Response }> {
  try {
    return { data: await request.json() };
  } catch {
    return { error: new Response("Invalid JSON", { status: 400 }) };
  }
}
```

**Pros:**
- DRY
- Consistent error handling
- Type-safe

**Cons:**
- Additional abstraction

**Effort:** 1 hour

**Risk:** Low

## Recommended Action

**To be filled during triage.**

## Technical Details

**Affected files:**
- All API routes that parse JSON body

## Acceptance Criteria

- [ ] All `request.json()` calls have error handling
- [ ] Malformed JSON returns 400 status
- [ ] Clear error messages

## Work Log

### 2026-01-18 - Initial Discovery

**By:** Claude Code (workflows:review - kieran-typescript-reviewer)

**Actions:**
- Identified missing JSON parse error handling
- Catalogued affected routes
