import { n as createVNode, p as Fragment, r as __astro_tag_component__ } from "./jsx-runtime_DQm_vd0H.mjs";
//#region src/content/case-studies/how-synthetix-modernized-banking-infrastructure.mdx
function _createMdxContent(props) {
	const _components = Object.assign({
		blockquote: "blockquote",
		em: "em",
		h2: "h2",
		li: "li",
		p: "p",
		strong: "strong",
		ul: "ul"
	}, props.components);
	return createVNode(Fragment, { children: [
		createVNode(_components.h2, {
			id: "company-overview",
			children: createVNode(_components.strong, { children: "Company Overview" })
		}),
		"\n",
		createVNode(_components.p, { children: "A leading U.S. banking technology provider, serving 75+ financial institution clients through its digital account origination platform. The platform handles regulated onboarding workflows subject to BSA/AML, CIP, OFAC, and Reg E/DD/CC requirements across its client base." }),
		"\n",
		createVNode(_components.h2, {
			id: "the-challenge",
			children: createVNode(_components.strong, { children: "The Challenge" })
		}),
		"\n",
		createVNode(_components.p, { children: "The provider needed to migrate its digital account origination platform from Kotlin/Spring Boot to Go, across 5 modules, 163 classes, and 23 REST endpoints, without breaking regulatory compliance or exposing PII embedded throughout the codebase. A manual migration approach carried unacceptable compliance and cost risk given the scale and regulatory exposure involved." }),
		"\n",
		createVNode(_components.h2, {
			id: "synthetix-solution",
			children: createVNode(_components.strong, { children: "Synthetix Solution" })
		}),
		"\n",
		createVNode(_components.p, { children: "A governed migration pipeline that combined automated codebase comprehension, compliance verification, and PII-aware translation into a single, auditable workflow." }),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: [createVNode(_components.strong, { children: "Codebase Comprehension" }), ": Auto-analyzed 106 source modules, 163 classes, 463 cross-module dependencies, and 5,064 lines of code, with coupling scores generated for every module"] }),
			"\n",
			createVNode(_components.li, { children: [createVNode(_components.strong, { children: "Integration Topology" }), ": Mapped every external integration, including IDV, KYC/AML, ACH and card rails, and e-sign, capturing call patterns, authentication modes, retry posture, and data flow"] }),
			"\n",
			createVNode(_components.li, { children: [createVNode(_components.strong, { children: "Architecture Artifacts" }), ": Auto-produced five enterprise-grade documents in days, including Legacy HLD, Target HLD, Stakeholder BRD, Capability BRD, and Technical Design Document"] }),
			"\n",
			createVNode(_components.li, { children: [createVNode(_components.strong, { children: "Service Decomposition" }), ": Decomposed the Kotlin monolith into target Go services across two migration phases, with full API contracts, data models, and non-functional requirement targets"] }),
			"\n",
			createVNode(_components.li, { children: [createVNode(_components.strong, { children: "Compliance Critic Mode" }), ": Generated a regulatory traceability matrix confirming that every BSA/AML, CIP, OFAC, and Reg E/DD/CC compliance touchpoint was preserved in the Go target"] }),
			"\n",
			createVNode(_components.li, { children: [createVNode(_components.strong, { children: "PII-Aware Translation" }), ": Identified every PII surface, including SSN, date of birth, account numbers, and driver’s license data, and enforced encryption-at-rest, redacted structured logging, and tokenization throughout"] }),
			"\n"
		] }),
		"\n",
		createVNode(_components.blockquote, { children: [
			"\n",
			createVNode(_components.p, { children: [
				createVNode(_components.em, { children: "“Synthetix delivered in 12 weeks what a traditional engagement would take 6+ months to scope. The compliance traceability output alone removed months of audit preparation from our migration plan.”" }),
				" ",
				createVNode(_components.em, { children: "— VP Engineering, leading U.S. banking technology provider" })
			] }),
			"\n"
		] }),
		"\n",
		createVNode(_components.h2, {
			id: "the-results",
			children: createVNode(_components.strong, { children: "The Results" })
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: "80% reduction in analysis effort, with 106 modules analyzed in hours instead of weeks" }),
			"\n",
			createVNode(_components.li, { children: "12-week delivery for a full modernization proof of concept, against a 6+ month industry norm" }),
			"\n",
			createVNode(_components.li, { children: "5 enterprise documents produced in days, eliminating months of manual documentation work" }),
			"\n",
			createVNode(_components.li, { children: "Zero compliance gaps, verified through an automated regulatory traceability matrix" }),
			"\n",
			createVNode(_components.li, { children: "Reduced migration risk, with PII-aware translation and compliance verification built directly into the pipeline rather than added afterward" }),
			"\n",
			createVNode(_components.li, { children: "Lower total engagement cost and faster time to value, driven by reduced team size and rework" }),
			"\n"
		] }),
		"\n",
		createVNode(_components.h2, {
			id: "capabilities-demonstrated",
			children: createVNode(_components.strong, { children: "Capabilities demonstrated" })
		}),
		"\n",
		createVNode(_components.p, { children: "AI Comprehension · Compliance-Aware · PII-Safe Translation · Multi-Language · Enterprise Documentation · Banking-Native" })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? createVNode(MDXLayout, Object.assign({}, props, { children: createVNode(_createMdxContent, props) })) : _createMdxContent(props);
}
var frontmatter = {
	"title": "How Synthetix\xA0Modernized\xA0Banking Infrastructure in 12 Weeks",
	"date": "2026-07-19T00:00:00.000Z",
	"updated": "2026-07-20T00:00:00.000Z",
	"excerpt": "A leading U.S. banking technology provider, serving 75+ financial institution clients through its digital account origination platform. The platform handles regulated onboarding workflows subject to B"
};
function getHeadings() {
	return [
		{
			"depth": 2,
			"slug": "company-overview",
			"text": "Company Overview"
		},
		{
			"depth": 2,
			"slug": "the-challenge",
			"text": "The Challenge"
		},
		{
			"depth": 2,
			"slug": "synthetix-solution",
			"text": "Synthetix Solution"
		},
		{
			"depth": 2,
			"slug": "the-results",
			"text": "The Results"
		},
		{
			"depth": 2,
			"slug": "capabilities-demonstrated",
			"text": "Capabilities demonstrated"
		}
	];
}
var url = "src/content/case-studies/how-synthetix-modernized-banking-infrastructure.mdx";
var file = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/case-studies/how-synthetix-modernized-banking-infrastructure.mdx";
var Content = (props = {}) => MDXContent({
	...props,
	components: {
		Fragment,
		...props.components
	}
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/content/case-studies/how-synthetix-modernized-banking-infrastructure.mdx";
__astro_tag_component__(Content, "astro:jsx");
//#endregion
export { Content, Content as default, file, frontmatter, getHeadings, url };
