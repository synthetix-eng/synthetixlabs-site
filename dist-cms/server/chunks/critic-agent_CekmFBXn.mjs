import { n as createVNode, p as Fragment, r as __astro_tag_component__ } from "./jsx-runtime_DQm_vd0H.mjs";
//#region src/content/agent-docs/critic-agent.mdx
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
		createVNode(_components.p, { children: "Critic is the independent quality and policy challenge surface. In Synthetix it is implemented as a critic family that evaluates analyst, architecture, and ARL outputs against deterministic rules and governance expectations." }),
		"\n",
		createVNode(_components.h3, {
			id: "business-value",
			children: "Business Value"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "Finds inconsistencies before they become delivery defects." }),
			"\n",
			createVNode(_components.li, { children: "Enforces policy adherence and structural quality gates." }),
			"\n",
			createVNode(_components.li, { children: "Improves trust in generated outputs through explicit findings." }),
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
			createVNode(_components.li, { children: "Run rule-based validation over stage artifacts." }),
			"\n",
			createVNode(_components.li, { children: "Generate findings with severity and remediation guidance." }),
			"\n",
			createVNode(_components.li, { children: "Block, revise, or clear outputs based on configured thresholds." }),
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
			createVNode(_components.li, { children: "Analyst, architecture, planning, and related stage artifacts." }),
			"\n",
			createVNode(_components.li, { children: "Critic rule packs and governance criteria." }),
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
			createVNode(_components.li, { children: "Critic reports, findings, verdict signals, and remediation prompts." }),
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
			createVNode(_components.li, { children: "Clear validator namespaces and ownership boundaries." }),
			"\n",
			createVNode(_components.li, { children: "Repeatable findings and traceable decision rationale." }),
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
			createVNode(_components.li, { children: "Slug: /docs/agents/critic" }),
			"\n",
			createVNode(_components.li, { children: "Primary Audience: QA governance, architecture governance, technical assurance teams." }),
			"\n"
		] })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? createVNode(MDXLayout, Object.assign({}, props, { children: createVNode(_createMdxContent, props) })) : _createMdxContent(props);
}
var frontmatter = {
	"title": "Critic Agent",
	"date": "2026-07-21T00:00:00.000Z",
	"updated": "2026-07-21T00:00:00.000Z",
	"excerpt": "Critic is the independent quality and policy challenge surface. In Synthetix it is implemented as a critic family that evaluates analyst, architecture, and ARL outputs against deterministic rules and ",
	"agent": "Critic"
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
var url = "src/content/agent-docs/critic-agent.mdx";
var file = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/agent-docs/critic-agent.mdx";
var Content = (props = {}) => MDXContent({
	...props,
	components: {
		Fragment,
		...props.components
	}
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/agent-docs/critic-agent.mdx";
__astro_tag_component__(Content, "astro:jsx");
//#endregion
export { Content, Content as default, file, frontmatter, getHeadings, url };
