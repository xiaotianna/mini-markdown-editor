#!/usr/bin/env zx

import "zx/globals";

await Promise.all([
  $`pnpm -F @mini-markdown-rc/editor lint`,
  $`pnpm -F @mini-markdown-rc/ast-parser lint`,
]);
