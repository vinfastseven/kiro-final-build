# Property-Based Testing Specification

## Target Function: resolveI18nPath(path: string, lang: string)

### Invariant Properties (强制不变属性规则)
1. **Never Null Property**:
   For ALL string inputs `path` and `lang`, `resolveI18nPath(path, lang)` SHALL NEVER return null or undefined, and MUST always return a valid relative URL string starting with `/`.

2. **Language Prefix Invariant**:
   For ANY valid language code `lang` (e.g., "zh", "en", "ja"), the output path MUST always start with `/${lang}/`.

### Kiro PBT Instruction
- Use fast-check or Vitest to automatically generate 200+ random test cases (including empty strings, symbols, unexpected unicode) to verify the invariants above.