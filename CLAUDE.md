# CLAUDE.md

## Project structure

```
src/nonview/           Non-UI code
  base/                Generic code, reusable across repos
  core/                Repo-specific logic
  constants/           Constants
src/view/              UI code
  atoms/               Single-purpose, stateless components
  molecules/           Compositions of atoms, stateless
  organisms/           Stateful components
  pages/               Page-level components
```

## Rules

- Place new code in the correct directory. If a module in `nonview/core` has no repo-specific dependencies, it belongs in `nonview/base`.
- `view/atoms` and `view/molecules` must be stateless. No `useState`, `useEffect`, or other hooks holding state. State lives in `view/organisms` and `view/pages`.
- Molecules compose atoms. Atoms do not compose other atoms.
- No hardcoded strings, numbers, or config values in components. Put them in `nonview/constants`.
- UI code may import from `nonview`. `nonview` must never import from `view`.

## After every code change

Run, in order:

```shell
npx eslint --fix --ext .js src
npx eslint --ext .js src
npx prettier --write --log-level warn src
```

Fix any remaining lint errors before finishing.