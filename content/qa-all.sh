#!/usr/bin/env bash
# Сводная автопроверка всех черновиков: bash content/qa-all.sh [country]
cd "$(dirname "$0")"
for d in drafts/${1:-*}/*/; do
  [ -f "$d/draft.md" ] || continue
  node qa.mjs "${d%/}" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{const r=JSON.parse(s);const flags=[];if(!r.withinLimits)flags.push("words "+r.words);if(r.bannedHits.length)flags.push("banned:"+r.bannedHits);if(r.b2bHits.length)flags.push("b2b:"+r.b2bHits);if(r.badLinks.length)flags.push("links:"+r.badLinks);if(r.missingFacts.length)flags.push("missing:"+r.missingFacts);if(r.unconfirmedFactsReview.length)flags.push("❓:"+r.unconfirmedFactsReview);if(r.outdatedFacts.length)flags.push("outdated:"+r.outdatedFacts);if(r.checkNotesInBody)flags.push("inline-checks:"+r.checkNotesInBody);console.log((flags.length?"⚠ ":"✓ ")+r.page.replace("drafts/","")+"  "+r.words+"w  "+flags.join(" | "))})'
done
