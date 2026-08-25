import { n as createVNode, p as Fragment, r as __astro_tag_component__ } from "./jsx-runtime_DQm_vd0H.mjs";
//#region src/content/agent-docs/cartographer-agent.mdx
function _createMdxContent(props) {
	const _components = Object.assign({
		h3: "h3",
		li: "li",
		p: "p",
		ul: "ul"
	}, props.components);
	return createVNode(Fragment, { children: [
		createVNode(_components.h3, {
			id: "overview",
			children: "Overview"
		}),
		"\n",
		createVNode(_components.p, { children: "Cartographer is the discovery and system-mapping documentation surface. In Synthetix this capability is delivered by Analyst plus the Discover agent trio, which together produce structural visibility of routes, data, background execution, and capability intent." }),
		"\n",
		createVNode(_components.h3, {
			id: "business-value",
			children: "Business Value"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "Builds a reliable map of current-state behavior before modernization decisions are made." }),
			"\n",
			createVNode(_components.li, { children: "Reduces blind spots by grounding architecture input in deterministic discovery artifacts." }),
			"\n",
			createVNode(_components.li, { children: "Improves migration confidence by exposing hidden dependencies early." }),
			"\n"
		] }),
		"\n",
		createVNode(_components.h3, {
			id: "core-responsibilities",
			children: "Core Responsibilities"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "Identify modules, responsibilities, and business capability touchpoints." }),
			"\n",
			createVNode(_components.li, { children: "Resolve dispatch and ownership paths for legacy and mixed stacks." }),
			"\n",
			createVNode(_components.li, { children: "Build database routine and dependency visibility for downstream planning." }),
			"\n",
			createVNode(_components.li, { children: "Enrich background-job and asynchronous workload understanding." }),
			"\n"
		] }),
		"\n",
		createVNode(_components.h3, {
			id: "key-inputs",
			children: "Key Inputs"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "Source code, route definitions, schema and SQL assets, job/scheduler artifacts." }),
			"\n",
			createVNode(_components.li, { children: "Engagement context from intake and analyst evidence." }),
			"\n"
		] }),
		"\n",
		createVNode(_components.h3, {
			id: "key-outputs",
			children: "Key Outputs"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "Analyst requirement and capability context." }),
			"\n",
			createVNode(_components.li, { children: "Dispatch resolution artifacts." }),
			"\n",
			createVNode(_components.li, { children: "Database catalog artifacts." }),
			"\n",
			createVNode(_components.li, { children: "Enriched background-job inventory." }),
			"\n"
		] }),
		"\n",
		createVNode(_components.h3, {
			id: "governance-and-controls",
			children: "Governance and Controls"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "Deterministic, evidence-first extraction where supported." }),
			"\n",
			createVNode(_components.li, { children: "Confidence and unresolved markers when source evidence is incomplete." }),
			"\n"
		] }),
		"\n",
		createVNode(_components.h3, {
			id: "typical-cta-page-metadata",
			children: "Typical CTA Page Metadata"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "Slug: /docs/agents/cartographer" }),
			"\n",
			createVNode(_components.li, { children: "Primary Audience: Discovery teams, architects, modernization analysts." }),
			"\n"
		] })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? createVNode(MDXLayout, Object.assign({}, props, { children: createVNode(_createMdxContent, props) })) : _createMdxContent(props);
}
var frontmatter = {
	"title": "Cartographer Agent",
	"date": "2026-07-19T00:00:00.000Z",
	"updated": "2026-07-29T00:00:00.000Z",
	"excerpt": "Cartographer is the discovery and system-mapping documentation surface. In Synthetix this capability is delivered by Analyst plus the Discover agent trio, which together produce structural visibility ",
	"agent": "Cartographer"
};
function getHeadings() {
	return [
		{
			"depth": 3,
			"slug": "overview",
			"text": "Overview"
		},
		{
			"depth": 3,
			"slug": "business-value",
			"text": "Business Value"
		},
		{
			"depth": 3,
			"slug": "core-responsibilities",
			"text": "Core Responsibilities"
		},
		{
			"depth": 3,
			"slug": "key-inputs",
			"text": "Key Inputs"
		},
		{
			"depth": 3,
			"slug": "key-outputs",
			"text": "Key Outputs"
		},
		{
			"depth": 3,
			"slug": "governance-and-controls",
			"text": "Governance and Controls"
		},
		{
			"depth": 3,
			"slug": "typical-cta-page-metadata",
			"text": "Typical CTA Page Metadata"
		}
	];
}
var url = "src/content/agent-docs/cartographer-agent.mdx";
var file = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/agent-docs/cartographer-agent.mdx";
var Content = (props = {}) => MDXContent({
	...props,
	components: {
		Fragment,
		...props.components
	}
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/agent-docs/cartographer-agent.mdx";
__astro_tag_component__(Content, "astro:jsx");
//#endregion
export { Content, Content as default, file, frontmatter, getHeadings, url };
