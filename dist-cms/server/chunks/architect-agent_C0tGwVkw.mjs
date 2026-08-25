import { n as createVNode, p as Fragment, r as __astro_tag_component__ } from "./jsx-runtime_DQm_vd0H.mjs";
//#region src/content/agent-docs/architect-agent.mdx
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
		createVNode(_components.p, { children: "Architect is the target-state design authority. It converts validated requirement intent into service architecture, integration contracts, and delivery-ready technical handoff artifacts." }),
		"\n",
		createVNode(_components.h3, {
			id: "business-value",
			children: "Business Value"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "Establishes architecture coherence before implementation starts." }),
			"\n",
			createVNode(_components.li, { children: "Prevents rework by issuing traceable, contract-driven design outputs." }),
			"\n",
			createVNode(_components.li, { children: "Aligns modernization direction with system constraints and risk." }),
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
			createVNode(_components.li, { children: "Define service boundaries and architecture structure." }),
			"\n",
			createVNode(_components.li, { children: "Produce architecture package outputs and decision records." }),
			"\n",
			createVNode(_components.li, { children: "Issue handoff contracts for implementation tracks." }),
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
			createVNode(_components.li, { children: "Analyst outputs, intake context, and reimagination intent where applicable." }),
			"\n",
			createVNode(_components.li, { children: "Architectural controls, track directives, and run constraints." }),
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
			createVNode(_components.li, { children: "Architect output and architecture handoff package." }),
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
			createVNode(_components.li, { children: "Critic-compatible traceability requirements." }),
			"\n",
			createVNode(_components.li, { children: "Halted-state behavior when architecture integrity is insufficient." }),
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
			createVNode(_components.li, { children: "Slug: /docs/agents/architect" }),
			"\n",
			createVNode(_components.li, { children: "Primary Audience: Solution architects, principal engineers, modernization leads." }),
			"\n"
		] })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? createVNode(MDXLayout, Object.assign({}, props, { children: createVNode(_createMdxContent, props) })) : _createMdxContent(props);
}
var frontmatter = {
	"title": "Architect\xA0Agent",
	"date": "2026-07-21T00:00:00.000Z",
	"updated": "2026-07-21T00:00:00.000Z",
	"excerpt": "Architect is the target-state design authority. It converts validated requirement intent into service architecture, integration contracts, and delivery-ready technical handoff artifacts.",
	"agent": "Architect\xA0Agent"
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
var url = "src/content/agent-docs/architect-agent.mdx";
var file = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/agent-docs/architect-agent.mdx";
var Content = (props = {}) => MDXContent({
	...props,
	components: {
		Fragment,
		...props.components
	}
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/agent-docs/architect-agent.mdx";
__astro_tag_component__(Content, "astro:jsx");
//#endregion
export { Content, Content as default, file, frontmatter, getHeadings, url };
