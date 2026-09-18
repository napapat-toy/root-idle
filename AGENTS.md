<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Guidelines

## 📌 Version Update Rule (การอัปเดตเวอร์ชันเกม)
ทุกครั้งที่มีการอัปเดตเลขเวอร์ชัน (Version Bump) จะต้องแก้ไขให้ตรงกันทั้ง **3 ไฟล์นี้เสมอ**:
1. `package.json` — ฟิลด์ `"version": "x.y.z"`
2. `src/constants/formulas.ts` — ตัวแปร `export const GAME_VERSION = 'x.y.z';`
3. `README.md` — แบดจ์ `![Version](https://img.shields.io/badge/version-x.y.z-orange?style=for-the-badge)`
