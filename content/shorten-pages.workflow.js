export const meta = {
  name: 'shorten-pages',
  description: 'Trim over-length page drafts to the word limit without losing facts',
  phases: [{ title: 'Trim' }],
}
// args.pages: [{ page: "<country>/<folder>", limit: 2000 }, ...]
const gen = ({ page, limit }) => `Do NOT spawn sub-agents. You are an editor trimming an existing SEO page draft.

File: D:/applications/!done/application/content/drafts/${page}/draft.md
Style rules: D:/applications/!done/application/content/prompts/system.md (read it first; keep every rule).
Brief (structure and keywords): D:/applications/!done/application/content/drafts/${page}/brief.md

Task: cut the body to at most ${limit} words (body = everything between the frontmatter and <!-- editor-notes -->), without removing facts, numbers, tables, FAQ answers, video slots, the quiz block or internal links.
How to cut: remove repetition between sections, redundant lead-ins, filler sentences, duplicated explanations of the same rule, and over-long transitions. Merge sentences that say the same thing twice. Prefer trimming prose, not tables or FAQ.
Do not: invent or change facts or numbers, drop honesty/risk sections, drop the CTA, change frontmatter (except leaving facts_used as is), or change the file's block markers.
Keep LF line endings. Append one line to editor-notes: "- Сокращено при финальной вычитке: было N слов, стало M."
Reply ≤60 words: page, words before, words after.`

phase('Trim')
const results = await parallel(args.pages.map(p => () => agent(gen(p), { label: p.page, phase: 'Trim' })))
return results.map((r, i) => ({ page: args.pages[i].page, result: r }))
