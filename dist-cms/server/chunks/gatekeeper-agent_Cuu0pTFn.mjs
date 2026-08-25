import { n as createVNode, p as Fragment, r as __astro_tag_component__ } from "./jsx-runtime_DQm_vd0H.mjs";
//#region src/content/agent-docs/gatekeeper-agent.mdx
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
		createVNode(_components.p, { children: "Gatekeeper is the policy-enforcement documentation surface for promotion decisions. In Synthetix, gate behavior is distributed across Conductor, Validator, and Deployer controls." }),
		"\n",
		createVNode(_components.h3, {
			id: "business-value",
			children: "Business Value"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "Prevents unsafe progression between stages." }),
			"\n",
			createVNode(_components.li, { children: "Enforces policy-backed release criteria." }),
			"\n",
			createVNode(_components.li, { children: "Creates transparent go/no-go decision points." }),
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
			createVNode(_components.li, { children: "Enforce transition preconditions." }),
			"\n",
			createVNode(_components.li, { children: "Apply validation and release quality thresholds." }),
			"\n",
			createVNode(_components.li, { children: "Block or route revision paths when controls are not met." }),
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
			createVNode(_components.li, { children: "Stage outputs, critic and validation findings, deployment readiness context." }),
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
			createVNode(_components.li, { children: "Gate outcomes, hold/block signals, and required remediation steps." }),
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
			createVNode(_components.li, { children: "Policy-driven transition and release checks." }),
			"\n",
			createVNode(_components.li, { children: "Auditable gate outcomes for compliance and governance reviews." }),
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
			createVNode(_components.li, { children: "Slug: /docs/agents/gatekeeper" }),
			"\n",
			createVNode(_components.li, { children: "Primary Audience: Governance boards, release owners, platform operations." }),
			"\n"
		] })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? createVNode(MDXLayout, Object.assign({}, props, { children: createVNode(_createMdxContent, props) })) : _createMdxContent(props);
}
var frontmatter = {
	"title": "Gatekeeper Agent",
	"date": "2026-07-21T00:00:00.000Z",
	"updated": "2026-07-21T00:00:00.000Z",
	"excerpt": "Gatekeeper is the policy-enforcement documentation surface for promotion decisions. In Synthetix, gate behavior is distributed across Conductor, Validator, and Deployer controls.",
	"agent": "Gatekeeper"
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
var url = "src/content/agent-docs/gatekeeper-agent.mdx";
var file = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/agent-docs/gatekeeper-agent.mdx";
var Content = (props = {}) => MDXContent({
	...props,
	components: {
		Fragment,
		...props.components
	}
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/agent-docs/gatekeeper-agent.mdx";
__astro_tag_component__(Content, "astro:jsx");
//#endregion
export { Content, Content as default, file, frontmatter, getHeadings, url };
