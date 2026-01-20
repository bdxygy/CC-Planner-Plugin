---
description: Validate a project plan for structure, consistency, testing completeness, and technical feasibility
argument-hint: [feature-topic]
allowed-tools: ["Read", "Glob", "Grep", "Bash"]
---

# /validate-plan

Validate a project plan for quality and completeness. Checks structure validation, cross-section consistency, testing completeness, and technical feasibility.

## When to Use

Use this command when:
- Verifying a plan before implementation
- After revising a plan with /revise-planning
- Ensuring plan follows best practices
- Checking that testing coverage is complete

## Validation Workflow

### 1. Locate and Load Plan

First, identify the plan to validate:

**Ask the user:**
- Which feature-topic plan to validate?
- Or scan for all available plans: `Glob ".pland/**/project-context.mdx"`

**Read all plan files:**
```bash
Read .pland/[feature-topic]/project-context.mdx
Read .pland/[feature-topic]/features.mdx
Read .pland/[feature-topic]/frontend-architecture.mdx
Read .pland/[feature-topic]/backend-architecture.mdx
Read .pland/[feature-topic]/frontend-testing-scenarios.mdx
Read .pland/[feature-topic]/backend-testing-cases.mdx
```

### 2. Structure Validation

Check that all required files exist and have proper structure:

**Required files check:**
- [ ] `project-context.mdx` exists
- [ ] `features.mdx` exists
- [ ] `frontend-architecture.mdx` exists
- [ ] `backend-architecture.mdx` exists
- [ ] `frontend-testing-scenarios.mdx` exists
- [ ] `backend-testing-cases.mdx` exists

**Content structure check:**
- [ ] project-context.mdx has: overview, tech stack, constraints
- [ ] features.mdx has: feature list with purpose and responsibilities
- [ ] frontend-architecture.mdx has: components, state, APIs, error handling
- [ ] backend-architecture.mdx has: modules, endpoints, contracts, validation
- [ ] frontend-testing-scenarios.mdx has: scenarios for each feature
- [ ] backend-testing-cases.mdx has: test cases for each feature

**File format check:**
- [ ] Files are valid markdown (.mdx format)
- [ ] No empty files
- [ ] Files have clear section headings
- [ ] Code blocks are properly formatted

### 3. Cross-Section Consistency

Verify that all sections align with each other:

**Feature vs. Testing alignment:**
- [ ] Every feature in features.mdx has frontend testing scenarios
- [ ] Every feature in features.mdx has backend testing cases
- [ ] Testing scenarios match feature responsibilities

**Feature vs. Architecture alignment:**
- [ ] Feature frontend responsibilities match frontend architecture patterns
- [ ] Feature backend responsibilities match backend architecture structure
- [ ] New features can be implemented with defined architecture

**Frontend vs. Backend alignment:**
- [ ] Frontend API needs match backend endpoint definitions
- [ ] Data contracts are consistent between frontend and backend
- [ ] Authentication/authorization approach is consistent

**Tech stack consistency:**
- [ ] project-context.mdx tech stack matches architecture patterns
- [ ] All technology choices are compatible
- [ ] No conflicting framework/library versions mentioned

### 4. Testing Completeness

Verify that testing coverage is comprehensive:

**Frontend testing scenarios:**
- [ ] Each feature has happy path scenarios
- [ ] Each feature has edge case scenarios
- [ ] Each feature has failure state scenarios
- [ ] Scenarios are user-centric (describe user actions)
- [ ] Scenarios are specific and testable

**Backend testing cases:**
- [ ] Each feature has business rule tests
- [ ] Each feature has boundary condition tests
- [ ] Each feature has failure mode tests
- [ ] Test cases are logic-driven (not HTTP-dependent)
- [ ] Test cases are specific and verifiable

**Testing isolation check:**
- [ ] Backend tests don't require HTTP
- [ ] Backend tests don't require database
- [ ] Tests describe mocked/stubbed dependencies
- [ ] Tests are truly unit tests (not integration)

### 5. Technical Feasibility

Verify that the plan is technically sound:

**Architecture feasibility:**
- [ ] Frontend architecture is implementable
- [ ] Backend architecture is implementable
- [ ] Chosen technologies are compatible
- [ ] Patterns are appropriate for the problem domain

**Brownfield specific checks (if existing project):**
- [ ] New features integrate with existing architecture
- [ ] Identified technical debt is acknowledged
- [ ] Migration paths are viable
- [ ] No breaking changes without migration plan

**Completeness check:**
- [ ] All major components are accounted for
- [ ] No "TBD" or "TODO" placeholders in critical sections
- [ ] Error handling is specified
- [ ] Authentication/authorization is addressed (if applicable)

### 6. Generate Validation Report

After all checks, generate a structured report:

**Report structure:**
```markdown
# Plan Validation Report: [feature-topic]

## Summary
[Overall assessment: PASS/FAIL/PASS WITH WARNINGS]

## Structure Validation
- [PASS/FAIL] Required files exist
- [PASS/FAIL] Content structure is complete
- [Details...]

## Cross-Section Consistency
- [PASS/FAIL] Features align with testing
- [PASS/FAIL] Features align with architecture
- [Details...]

## Testing Completeness
- [PASS/FAIL] Frontend scenarios are complete
- [PASS/FAIL] Backend cases are complete
- [Details...]

## Technical Feasibility
- [PASS/FAIL] Architecture is sound
- [PASS/FAIL] Technology choices are compatible
- [Details...]

## Issues Found
[List any CRITICAL, WARNING, or INFO items]

## Recommendations
[Suggestions for improving the plan]
```

## Validation Criteria

### PASS Criteria

All of the following:
- All required files exist and are non-empty
- Every feature has testing scenarios (frontend) and test cases (backend)
- Testing scenarios cover happy paths, edge cases, and failures
- Frontend and backend sections are consistent
- Architecture is technically feasible

### FAIL Criteria

Any of the following:
- Missing required files
- Features without testing coverage
- Frontend-backend API contract mismatches
- Technically infeasible architecture
- Critical incomplete sections

### WARNING Criteria

Any of the following:
- Incomplete testing scenarios (missing edge cases or failures)
- Vague or abstract content
- Minor inconsistencies between sections
- Missing non-critical information

## Interactive Usage

**When validating a specific plan:**
```bash
/validate-plan user-authentication
```

**When asked to validate:**
1. Ask which plan if not specified
2. Read all plan files
3. Run all validation checks
4. Generate and present report
5. Offer to fix any issues found

**After validation:**
- If PASS: Congratulate user, plan is ready for execution
- If FAIL: List critical issues, offer to help fix
- If WARNING: List warnings, ask if user wants to address them

## Example Output

```
# Plan Validation Report: user-authentication

## Summary
PASS WITH WARNINGS

## Structure Validation
✅ PASS - All required files exist
✅ PASS - Content structure is complete

## Cross-Section Consistency
✅ PASS - Features align with testing
⚠️ WARNING - 'reset-password' feature frontend scenarios don't mention API error handling

## Testing Completeness
✅ PASS - Frontend scenarios cover happy paths, edges, failures
⚠️ WARNING - 'reset-password' backend test cases missing password complexity validation test

## Technical Feasibility
✅ PASS - Architecture is sound
✅ PASS - Technology choices are compatible (React 18, Hono v3, Bun)

## Issues Found
**WARNING:** Feature 'reset-password' is missing API error handling in frontend scenarios
**WARNING:** Backend test cases for 'reset-password' don't test password complexity validation

## Recommendations
1. Add frontend testing scenario for password reset API errors
2. Add backend test case for password complexity validation in reset flow
3. Consider adding rate limiting scenarios for password reset endpoint
```

## Related Commands

- `/planning` - Create a new plan
- `/revise-planning` - Fix issues found during validation
- `/execute` - Implement after validation passes

## Notes

- Validation is based on plan documentation, not code
- Use /revise-planning to fix validation issues
- Re-run validation after revisions to verify fixes
