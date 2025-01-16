#!/usr/bin/env zx

import 'zx/globals'

await Promise.all([
    $`pnpm -F @mini-markdown/editor lint`,
    $`pnpm -F @mini-markdown/material lint`,
    $`pnpm -F @mini-markdown/ast-parser lint`,
])
