# vite 8 (rolldown) + `ssr.target: 'webworker'`: bundled CJS `require("<builtin>")` left as a throwing stub

Minimal reproduction for a Vite SSR webworker build gap that survives the fix in
[#21963](https://github.com/vitejs/vite/pull/21963) (fix [#21969](https://github.com/vitejs/vite/issues/21969)).

## Repro

```bash
pnpm install
pnpm build          # uses vite.config.js
cat dist/entry.js
```

`dist/entry.js` contains, for the bundled CommonJS module's nested `require("crypto")`:

```js
var crypto = __require("crypto");   // throwing stub under platform:'browser'
```

The `__require` runtime stub throws `Calling \`require\` for "crypto" in an
environment that doesn't expose the \`require\` function` — so this crashes on
Cloudflare Workers (workerd), where there is no global `require`. (In a framework
build such as SvelteKit that evaluates the SSR output during build analysis, the
build itself fails at this stub.)

`esmExternalRequirePlugin()` IS added by Vite for webworker SSR (PR #21963), but
it is invoked with an **empty `external`**, so it converts nothing.

## The fix (demonstrated)

Pass the node builtins / resolved externals to the plugin:

```bash
pnpm build --config vite.config.fix.js
cat dist-fixed/entry.js
```

Now the nested require is converted to a real ESM import (works on workerd):

```js
import * as m from "crypto";
// ...
var crypto = require_builtin_esm_external_require_crypto();  // -> m.default
```

So the fix is for Vite's webworker SSR wiring to call
`esmExternalRequirePlugin({ external: [...node builtins / resolved externals] })`
instead of `esmExternalRequirePlugin()`.
