# Project context

## Purpose

`246eBauGB` is a German-language, static information website about § 246e BauGB and building in the exterior area of Brandenburg. According to the repository README, it is aimed primarily at private property owners and combines pillar pages, a blog, source references, and search-oriented metadata. The site provides general information and explicitly does not provide legal advice.

## Technical structure

- Astro 6 with MDX, RSS, and sitemap integrations.
- Static output generated in `dist/` by `npm run build`.
- Canonical site URL `https://246ebaugb.de`, with trailing slashes enabled.
- The sitemap excludes `/check/`.
- Custom Astro components and CSS; no CSS framework is declared in `package.json`.
- The `blog` content collection loads Markdown and MDX from `src/content/blog/`.
- Blog frontmatter is validated for title, description, publication date, category, tags, region, intent, and sources. Allowed categories are `grundlagen`, `100m`, `aussenbereich`, `ablauf`, and `faq`.

## Content areas

- Four pillar pages cover the general § 246e overview, the 100-metre interpretation aid and spatial relationship, the exterior area, and municipal consent.
- The blog contains practical articles on procedure, environmental review, development, densification, changes of use, deadlines, and municipal consent.
- `/check/` is currently a placeholder for a future, non-binding property check.
- Legal pages, an RSS feed, sitemap generation, SEO metadata, source boxes, and a legal disclaimer are part of the site.

## Important paths

- `src/pages/`: routed pages, pillar pages, legal pages, RSS, and the check placeholder.
- `src/content/blog/`: blog entries managed by the Astro content collection.
- `src/content.config.ts`: blog schema and allowed categories.
- `src/components/`: SEO, source display, and disclaimer components.
- `src/layouts/`: shared page and article layouts.
- `research/evidence/` and `research/faq/`: source material, raw research exports, patched evidence, FAQs, and errata.
- `site/outline/` and `site/snippets/`: content outlines and reusable copy snippets.
- `public/`: static assets.
- `CONTENT_DOD.md`: pre-publication quality and safety checklist.
- `PROMPT_CONTRACT.md`: structure and sourcing contract for generated blog content.

## Source and documentation rules

- Every material factual or legal assertion needs a source; primary sources such as statutes, parliamentary materials, and official guidance come first.
- The 100-metre statement must be described as an interpretation aid from the legislative materials, not as a number contained in the statutory text. Distances at or below 100 metres still require an individual assessment.
- Do not publish unsupported statements about local administrative practice, fixed quotas, concrete geographic examples, costs, or rapidly changing lists.
- Time-sensitive figures and lists require a date, source, and instruction to verify the current official version.
- Article content must include the legal disclaimer and source presentation provided by the repository components.
- Content changes must follow both `CONTENT_DOD.md` and `PROMPT_CONTRACT.md`, including internal links, metadata, build validation, and the documented safety search.
- Files named `*.perplexity-raw.md` are preserved research inputs. The repository errata records later corrections; raw exports are not a substitute for current primary-source verification.

## Open knowledge gaps

- The interactive property check is not implemented; `/check/` is a placeholder.
- The errata explicitly leaves official verification of some Brandenburg reference data and future evidence about municipal practice open.
- The public site is deployed from the protected `main` branch through the linked Vercel project. Preview deployments run on task branches; production deployment is explicitly enabled in `vercel.json`.
- `npm run check` is the combined technical, content, language, SEO, build, and audit gate. `npm run legal:check` additionally validates the official source inventory and the separated official-source NotebookLM notebook on the Mac mini.
- Search Console reporting, public SEO monitoring, and source-freshness workflows are configured in GitHub. Their external account state still has to be verified in the respective service when an operational decision depends on it.
- Legal and administrative source currency must be rechecked before publication; the repository snapshot alone does not establish that external sources are still current.
