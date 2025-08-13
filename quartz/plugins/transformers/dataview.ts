import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { QuartzTransformerPlugin } from "../types"

type Row = { file: string; title?: string; [k: string]: any }

function parseBlock(src: string): { type: "TABLE" | "LIST"; from?: string; where?: string; sort?: { key: string; dir: "ASC" | "DESC" } } | null {
  const lines = src
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 0) return null
  const first = lines[0].toUpperCase()
  let type: "TABLE" | "LIST" | null = null
  if (first.startsWith("TABLE")) type = "TABLE"
  else if (first.startsWith("LIST")) type = "LIST"
  else return null

  let from: string | undefined
  let where: string | undefined
  let sort: { key: string; dir: "ASC" | "DESC" } | undefined

  for (const l of lines.slice(1)) {
    if (l.toUpperCase().startsWith("FROM ")) {
      const m = l.match(/FROM\s+"([^"]+)"/i)
      if (m) from = m[1]
    } else if (l.toUpperCase().startsWith("WHERE ")) {
      where = l.slice(6).trim()
    } else if (l.toUpperCase().startsWith("SORT ")) {
      const m = l.match(/SORT\s+([A-Za-z0-9_-]+)\s*(ASC|DESC)?/i)
      if (m) sort = { key: m[1], dir: (m[2]?.toUpperCase() as any) || "ASC" }
    }
  }

  return { type, from, where, sort }
}

function evaluateWhere(row: Row, expr?: string): boolean {
  if (!expr) return true
  let e = expr
  e = e.replace(/!=/g, "!==").replace(/=([^=])/g, "==$1")
  e = e.replace(/\bAND\b/gi, "&&").replace(/\bOR\b/gi, "||")
  e = e.replace(/([A-Za-z_][A-Za-z0-9_\-]*)/g, (m) => {
    if (["true", "false", "null"].includes(m.toLowerCase())) return m
    if (/^\d+$/.test(m)) return m
    return `row["${m}"]`
  })
  try {
    // eslint-disable-next-line no-new-func
    return Function("row", `return (${e});`)(row) ? true : false
  } catch {
    return true
  }
}

function htmlEscape(s: any): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function renderTable(rows: Row[], cols: string[]): string {
  const th = cols.map((c) => `<th>${htmlEscape(c)}</th>`).join("")
  const tb = rows
    .map((r) => `<tr>${cols.map((c) => `<td>${htmlEscape(r[c])}</td>`).join("")}</tr>`)
    .join("")
  return `<div class="dv-table"><table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`
}

function renderList(rows: Row[]): string {
  const li = rows.map((r) => `<li>${htmlEscape(r.title || r.file)}</li>`).join("")
  return `<div class="dv-list"><ul>${li}</ul></div>`
}

function collectRows(root: string, from?: string): Row[] {
  const base = root
  const targetDir = from ? path.join(base, from) : base
  const rows: Row[] = []
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const ent of entries) {
      const p = path.join(dir, ent.name)
      if (ent.isDirectory()) walk(p)
      else if (ent.isFile() && /\.md$/i.test(ent.name)) {
        try {
          const raw = fs.readFileSync(p, "utf8")
          const fm = matter(raw)
          const title = fm.data?.title || path.basename(p, ".md")
          rows.push({ file: path.relative(base, p), title, ...fm.data })
        } catch {}
      }
    }
  }
  walk(targetDir)
  return rows
}

export const Dataview: QuartzTransformerPlugin = () => {
  return {
    name: "Dataview",
    textTransform(_ctx, src) {
      const buildCwd = process.cwd()
      const vaultRoot = process.env.QUARTZ_VAULT || path.resolve(buildCwd, "..")

      return src.replace(/```dataview\n([\s\S]*?)```/g, (_m, body: string) => {
        const spec = parseBlock(body)
        if (!spec) return _m
        const rows0 = collectRows(vaultRoot, spec.from)
        let rows = rows0.filter((r) => evaluateWhere(r, spec.where))
        if (spec.sort) {
          const { key, dir } = spec.sort
          rows = rows.sort((a, b) => {
            const av = a[key]
            const bv = b[key]
            if (av == null && bv == null) return 0
            if (av == null) return 1
            if (bv == null) return -1
            return av > bv ? 1 : av < bv ? -1 : 0
          })
          if (dir === "DESC") rows.reverse()
        }

        if (spec.type === "TABLE") {
          const first = body.split(/\r?\n/)[0]
          const cols = first
            .slice("TABLE".length)
            .split(/[,\s]+/)
            .map((s) => s.trim())
            .filter(Boolean)
          return renderTable(rows, cols)
        } else {
          return renderList(rows)
        }
      })
    },
  }
}
