export const meta = {
  name: 'generate-pages',
  description: 'Generate SEO page drafts from briefs and fact sheets, one agent per page',
  phases: [{ title: 'Generate' }],
}
// args.pages: ["<country>/<page-folder>", ...] — папки в content/drafts с готовым brief.md
const pages = args.pages
const gen = p => {
  const lang = p.endsWith('-ru') ? 'Russian' : 'English'
  const notes = lang === 'English' ? ' (editor-notes in Russian)' : ''
  return `Do NOT spawn sub-agents. You are a content generator. Follow the system prompt EXACTLY as your operating instructions.
1. Read the system prompt: D:/applications/!done/application/content/prompts/system.md
2. Read the page brief: D:/applications/!done/application/content/drafts/${p}/brief.md
3. Read every fact sheet named in the brief (in D:/applications/!done/application/content/facts/); skip any that do not exist.
Use ONLY these files — nothing in docs/, no web search, no other drafts. Respect ✅/🟡/❌/❓ statuses exactly as the system prompt says.
Write the page (${lang}) in the exact output format of the system prompt (frontmatter, block markers, editor-notes at the end${notes}) to:
D:/applications/!done/application/content/drafts/${p}/draft.md (LF line endings).
Self-check: every number traceable to a fact ID in facts_used; no ❓ facts; no banned phrases; no B2B/commission info; keyword placement; length within the system prompt's range for the page type. Reply ≤80 words: path, word count, facts used, [ПРОВЕРИТЬ] notes.`
}
phase('Generate')
const results = await parallel(pages.map(p => () => agent(gen(p), { label: p, phase: 'Generate' })))
return results.map((r, i) => ({ page: pages[i], result: r }))
