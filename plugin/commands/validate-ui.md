---
description: Validate implemented UI against modern design standards: Modern, Aesthetic, Borderless, Responsive (mobile-first). Scans code files, reports violations with detailed fix suggestions.
argument-hint: [plan-name] [platform]
allowed-tools: ["AskUserQuestion", "Read", "Write", "Edit", "Glob", "Grep", "Bash", "mcp__plugin_context7_context7__resolve-library-id", "mcp__plugin_context7_context7__query-docs", "mcp__exa__get_code_context_exa", "mcp__exa__web_search_exa"]
---

# /validate-ui

Validate implemented UI against four core principles: Modern, Aesthetic, Borderless, and Responsive (mobile-first). Scans code files to detect violations and provides detailed reports with interactive fix suggestions.

## When to Use

Use this command when:
- Reviewing UI implementation after `/execute-fe`
- Ensuring UI follows modern design standards
- Checking code consistency across platforms
- Preparing for UI code review or production
- Validating design system adherence

## The Four Principles

### 1. Modern
- Modern design patterns and aesthetics
- Current framework versions and syntax
- No deprecated APIs or legacy components
- Modern UI composition (hooks, composables, etc.)

### 2. Aesthetic
- **Design consistency**: Consistent spacing, typography, colors, and patterns
- **Visual hierarchy**: Clear information hierarchy with proper contrast
- **Layout quality**: Proper use of white space, alignment, and grid systems
- **Polish and motion**: Appropriate animations, transitions, and micro-interactions

### 3. Borderless
- **No visible borders**: Cards, inputs, and containers without visible borders
- **Alternative separation**: Uses shadows, elevation, spacing, or background contrast instead
- **Edge-to-edge design**: Seamless, edge-to-edge layouts (especially on mobile)
- **Subtle focus states**: No harsh outline on focus; uses subtle indicators

### 4. Responsive (mobile-first)
- **Mobile baseline**: Works on mobile (320px+) without horizontal scroll
- **Adaptive breakpoints**: Responsive layouts for tablets and desktops
- **Touch targets**: Minimum 44px tap targets for touch interaction
- **Responsive typography**: Readable text sizes on all devices

## Validation Workflow

### 1. Detect Platform and UI Framework

**Use Glob to detect platform:**
```bash
# Android (Compose)
Glob "**/ui/**/*.kt"
Grep "@Composable" .

# Android (XML)
Glob "res/layout/**/*.xml"

# iOS (SwiftUI)
Glob "**/*.swift"
Grep "struct.*View.*Body" .

# iOS (UIKit)
Grep "class.*UIViewController" .

# Flutter
Glob "lib/**/*.dart"
Grep "class.*Widget" .

# React Native
Glob "src/components/**/*.{tsx,jsx}"
Grep "export.*function" .

# Web (React)
Glob "src/components/**/*.{tsx,jsx}"
```

**Load appropriate platform-specific skill** for validation patterns.

### 2. Scan UI Code Files

**Read all UI component files:**
```bash
# Platform-specific patterns
Android: app/src/main/java/**/*Activity.kt, **/*Fragment.kt, **/*Screen.kt
iOS: Sources/**/*.swift
Flutter: lib/**/*.dart
React Native: src/components/**/*.tsx
Web: src/components/**/*.tsx
```

### 3. Validate Against Four Principles

For each UI file, run validation checks:

#### Modern Validation

**Check for:**
- ❌ Deprecated APIs and components
- ❌ Legacy patterns (class components in React, Activities in Compose projects)
- ❌ Old framework versions
- ❌ Outdated design patterns

**Examples:**
```kotlin
// ❌ BAD: Using deprecated Material components
Card(elevation = 4.dp)  // Old API

// ✅ GOOD: Using modern Material 3
Card(
    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
)
```

```swift
// ❌ BAD: Using legacy UIKit when SwiftUI available
let label = UILabel()  // Old pattern

// ✅ GOOD: Using SwiftUI
Text("Hello")  // Modern
```

```tsx
// ❌ BAD: Class components
class MyComponent extends React.Component {  }

// ✅ GOOD: Functional components with hooks
function MyComponent() {  }
```

#### Aesthetic Validation

**Design Consistency:**
- Check for hardcoded values (colors, spacing, typography)
- Verify use of design tokens or theme system
- Check for consistent spacing patterns

**Visual Hierarchy:**
- Check font size variations (too similar sizes = poor hierarchy)
- Check color contrast ratios
- Verify heading levels and semantic structure

**Layout Quality:**
- Check for magic numbers in padding/margin
- Verify alignment and grid usage
- Check white space balance

**Polish and Motion:**
- Check for missing transitions
- Verify loading states
- Check for harsh or missing animations

**Examples:**
```kotlin
// ❌ BAD: Hardcoded values
Padding(16)  // Magic number
Text("Title", color = Color(0xFF0000))  // Hardcoded color

// ✅ GOOD: Using theme
Modifier.padding(MaterialTheme.spacing.medium)
Text("Title", color = MaterialTheme.colorScheme.primary)
```

```tsx
// ❌ BAD: Similar font sizes
<Text style={{ fontSize: 16 }}>Title</Text>
<Text style={{ fontSize: 15 }}>Subtitle</Text>  // Poor hierarchy

// ✅ GOOD: Clear hierarchy
<Text style={{ fontSize: 24, fontWeight: 'bold' }}>Title</Text>
<Text style={{ fontSize: 16 }}>Subtitle</Text>
```

#### Borderless Validation

**Check for:**
- ❌ Visible border properties (border, borderWidth, borderColor)
- ❌ Border-top, border-left, etc. in stylesheets
- ❌ Border on cards, inputs, buttons, containers

**Valid alternatives:**
- Shadows and elevation
- Background color contrast
- Spacing and padding
- Subtle dividers (hairlines)

**Examples:**
```kotlin
// ❌ BAD: Visible border
Surface(
    border = BorderStroke(1.dp, Color.Gray),
    modifier = Modifier.border(1.dp, Color.Gray)
)

// ✅ GOOD: Shadow/elevation instead
Card(
    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
)
```

```tsx
// ❌ BAD: Visible border
<div style={{ border: '1px solid #ccc' }}>  // Border!

// ✅ GOOD: Shadow or spacing
<div style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>

// ✅ GOOD: Background contrast
<div style={{ backgroundColor: '#f5f5f5', padding: '16px' }}>
```

```css
/* ❌ BAD: Border on card */
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
}

/* ✅ GOOD: Shadow instead */
.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
}
```

**Edge-to-edge check:**
- Verify no unnecessary padding on edges
- Check for full-width content
- Verify immersive layouts where appropriate

#### Responsive Validation

**Mobile baseline (320px+):**
- Check for fixed widths
- Verify flexible layouts (flex, grid, etc.)
- Check for overflow issues

**Adaptive breakpoints:**
- Verify responsive breakpoints
- Check for mobile-first approach
- Verify use of platform responsive APIs

**Touch targets (44px min):**
- Check button/interactive element sizes
- Verify padding on touchable elements
- Check minimum tap target dimensions

**Responsive typography:**
- Verify relative units (rem, em, %, sp)
- Check for readable base font size
- Verify text scaling support

**Examples:**
```tsx
// ❌ BAD: Fixed width
<div style={{ width: 1200 }}>  // Won't fit mobile

// ✅ GOOD: Responsive
<div style={{ maxWidth: '1200px', width: '100%' }}>
```

```tsx
// ❌ BAD: Touch target too small
<button style={{ padding: '4px 8px' }}>Click</button>  // < 44px

// ✅ GOOD: Proper touch target
<button style={{ padding: '12px 24px', minHeight: '44px' }}>Click</button>
```

```css
/* ❌ BAD: Fixed font size */
.text { font-size: 14px; }

/* ✅ GOOD: Responsive */
.text { font-size: clamp(1rem, 2.5vw, 1.25rem); }
```

### 4. Generate Violation Report

**Detailed report format:**
```markdown
# UI Validation Report: [plan-name] - [platform]

## Summary
- Total files scanned: [number]
- Violations found: [number]
  - Modern: [x] violations
  - Aesthetic: [x] violations
  - Borderless: [x] violations
  - Responsive: [x] violations

## Violations by Principle

### 1. Modern Violations ([x])

#### [VIOLATION] - [file:line]
- **Severity:** Critical/Warning/Info
- **Issue:** [Description of violation]
- **Location:** [file path:line number]
- **Current Code:**
  ```[language]
  [code snippet]
  ```
- **Suggested Fix:**
  ```[language]
  [fixed code snippet]
  ```

### 2. Aesthetic Violations ([x])
[... same format ...]

### 3. Borderless Violations ([x])
[... same format ...]

### 4. Responsive Violations ([x])
[... same format ...]

## Summary by File

| File | Modern | Aesthetic | Borderless | Responsive | Total |
|------|--------|------------|------------|------------|-------|
| [file1] | ✅ | ⚠️ 2 | ❌ 1 | ✅ | 3 |
| [file2] | ✅ | ✅ | ✅ | ❌ 2 | 2 |
| [file3] | ⚠️ 1 | ✅ | ✅ | ✅ | 1 |

## Recommendations

1. [High-priority recommendation]
2. [Medium-priority recommendation]
3. [Low-priority recommendation]
```

### 5. Interactive Fixing

After generating the report, **use AskUserQuestion** for each critical or warning violation:

```
"Found violation: [description] at [file:line]

Fix options:
1. Auto-fix (safe changes)
2. Show me the fix (review before applying)
3. Skip this violation
4. Skip all remaining violations

Which would you like?"
```

**For each fix:**
- Show the current code
- Show the suggested fix
- Apply the fix if user confirms
- Update the file using Edit tool
- Re-validate if requested

### 6. Final Summary

After all fixes (or user declines), provide:
```
✅ UI Validation Complete

Files Scanned: [number]
Violations Found: [number]
Fixes Applied: [number]
Remaining Violations: [number]

Next Steps:
- Review remaining violations manually
- Run [test command] to verify no regressions
- Commit changes: [git command]
```

## Platform-Specific Violations

### Android (Jetpack Compose)

**Modern violations:**
- Using `Card` instead of `CardDefaults.cardElevation`
- Using legacy Material components
- Using `Activity` instead of Compose navigation

**Aesthetic violations:**
- Hardcoded colors instead of `MaterialTheme.colorScheme`
- Magic numbers for spacing instead of `MaterialTheme.spacing`
- Inconsistent typography (using `TextStyle` directly)

**Borderless violations:**
- `Modifier.border()`
- `BorderStroke()` on surfaces
- `Surface` with visible border parameter

**Responsive violations:**
- Fixed `width()` modifiers
- `size(width = ..., height = ...)` without constraints
- Touch targets smaller than 48dp

### iOS (SwiftUI)

**Modern violations:**
- Using `UIKit` patterns in SwiftUI
- Not using `@State`, `@ObservedObject`, etc.
- Missing preview providers

**Aesthetic violations:**
- Hardcoded colors instead of semantic system colors
- Hardcoded font sizes instead of dynamic type
- Magic numbers for spacing and layout

**Borderless violations:**
- `.border()` modifier
- `.overlay(RoundedRectangle(...))` as border
- `stroke()` on shapes (use `shadow()` instead)

**Responsive violations:**
- Fixed `.frame(width: ..., height: ...)`
- Not using geometry reader for responsiveness
- Touch targets smaller than 44pt

### Flutter

**Modern violations:**
- Using `StatefulWidget` when `StatelessWidget` suffices
- Not using `const` constructors
- Legacy widget patterns

**Aesthetic violations:**
- Hardcoded `Color()` values instead of `Theme.of()`
- Hardcoded `TextStyle` instead of `Theme.of()`
- Magic numbers for spacing

**Borderless violations:**
- `BoxDecoration(border: Border(...))`
- `BorderSide` on cards and containers
- `OutlineInputBorder` with visible border

**Responsive violations:**
- Fixed `SizedBox(width: ..., height: ...)`
- Fixed `Container(width: ...)`
- Not using `LayoutBuilder` for responsiveness

### React Native

**Modern violations:**
- Class components instead of functional with hooks
- Not using `react-native-reanimated`
- Legacy navigation patterns

**Aesthetic violations:**
- Hardcoded colors instead of design tokens
- Inconsistent spacing (magic numbers)
- Not using Platform-specific styling

**Borderless violations:**
- `borderWidth` in styles
- `borderColor` in styles
- Visible borders on cards and inputs

**Responsive violations:**
- Fixed `width` in styles
- Not using flexbox for responsive layouts
- Touch targets smaller than 44px

### Web (React)

**Modern violations:**
- Class components instead of functional components
- Not using React hooks
- Legacy patterns (componentWillMount, etc.)

**Aesthetic violations:**
- Hardcoded inline styles
- Inconsistent spacing
- Poor color contrast

**Borderless violations:**
- CSS `border` properties
- Visible borders on all elements
- Harsh outline on focus

**Responsive violations:**
- Fixed pixel widths
- Not using media queries
- Touch targets smaller than 44px
- Not mobile-first approach

## Interactive Best Practices

- **Show code snippets** for each violation
- **Provide fix suggestions** with examples
- **Use AskUserQuestion** for interactive fixing
- **Be specific** with file locations and line numbers
- **Explain why** something violates a principle
- **Use Context7** for official framework documentation
- **Use Exa** for modern UI code examples and best practices:
  - `get_code_context_exa` - Modern component examples
  - `web_search_exa` - Latest UI/UX articles and patterns

## Output Format

```
Validating UI: [plan-name] - [platform]
Scanning UI files... ✅
Analyzing modern patterns... ✅
Checking aesthetic consistency... ✅
Detecting borders... ⚠️ 3 violations
Verifying responsiveness... ⚠️ 2 violations

Found 5 violations. Detailed report generated.
```

## Related Commands

- `/execute-fe` - Implement frontend using TDD
- `/planning` - Create a plan with UI specifications
- `/validate-plan` - Validate overall plan quality

## Notes

- Validates implemented code, not designs
- Focuses on code patterns that violate the four principles
- Interactive fixing with user confirmation
- Platform-specific validation rules
- **Context7** for official framework documentation and APIs
- **Exa** for modern UI code examples and best practices:
  - `get_code_context_exa` - Modern component patterns
  - `web_search_exa` - Latest UI/UX articles and design trends
