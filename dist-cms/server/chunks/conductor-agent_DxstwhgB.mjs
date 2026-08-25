import { n as createVNode, p as Fragment, r as __astro_tag_component__ } from "./jsx-runtime_DQm_vd0H.mjs";
//#region src/content/agent-docs/conductor-agent.mdx
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
		createVNode(_components.p, { children: "Conductor is the orchestration control plane for run execution. It manages stage movement, run-plan context, and state reconciliation across agent outcomes." }),
		"\n",
		createVNode(_components.h3, {
			id: "business-value",
			children: "Business Value"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "Maintains execution order and pipeline integrity." }),
			"\n",
			createVNode(_components.li, { children: "Provides auditability for stage-by-stage progression." }),
			"\n",
			createVNode(_components.li, { children: "Supports controlled recovery for partial or mixed outcomes." }),
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
			createVNode(_components.li, { children: "Maintain run plan and orchestration state." }),
			"\n",
			createVNode(_components.li, { children: "Route execution and reconcile per-agent outcomes." }),
			"\n",
			createVNode(_components.li, { children: "Preserve traceable run-level audit artifacts." }),
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
			createVNode(_components.li, { children: "Engagement context, target-state model, and stage status envelopes." }),
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
			createVNode(_components.li, { children: "Orchestration timeline, reconciled state transitions, audit trail." }),
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
			createVNode(_components.li, { children: "Strict precondition and transition handling." }),
			"\n",
			createVNode(_components.li, { children: "Non-destructive reconciliation semantics." }),
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
			createVNode(_components.li, { children: "Slug: /docs/agents/conductor" }),
			"\n",
			createVNode(_components.li, { children: "Primary Audience: Platform operators, delivery leads, architecture governance." }),
			"\n"
		] })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? createVNode(MDXLayout, Object.assign({}, props, { children: createVNode(_createMdxContent, props) })) : _createMdxContent(props);
}
var frontmatter = {
	"title": "Conductor Agent",
	"date": "2026-07-21T00:00:00.000Z",
	"updated": "2026-07-21T00:00:00.000Z",
	"excerpt": "Conductor is the orchestration control plane for run execution. It manages stage movement, run-plan context, and state reconciliation across agent outcomes.",
	"agent": "Conductor"
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
var url = "src/content/agent-docs/conductor-agent.mdx";
var file = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/agent-docs/conductor-agent.mdx";
var Content = (props = {}) => MDXContent({
	...props,
	components: {
		Fragment,
		...props.components
	}
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/agent-docs/conductor-agent.mdx";
__astro_tag_component__(Content, "astro:jsx");
//#endregion
export { Content, Content as default, file, frontmatter, getHeadings, url };
