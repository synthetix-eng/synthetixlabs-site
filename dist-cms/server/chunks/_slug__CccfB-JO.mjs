import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as createAstro, d as renderComponent, y as renderTemplate } from "./jsx-runtime_DQm_vd0H.mjs";
import { t as createComponent } from "./compiler_BQjKSGmA.mjs";
import { n as getCollection, r as renderEntry, t as $$Post } from "./Post_BZBLLH7l.mjs";
//#region src/pages/resources/blogs/resources/case-study/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://astro.build");
async function getStaticPaths() {
	return (await getCollection("case-studies", ({ data }) => !data.draft)).map((entry) => ({
		params: { slug: entry.id },
		props: { entry }
	}));
}
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const { entry } = Astro.props;
	const { Content } = await renderEntry(entry);
	return renderTemplate`${renderComponent($$result, "Post", $$Post, {
		"title": entry.data.title,
		"canonical": `https://synthetixlabs.ai/resources/blogs/resources/case-study/${entry.id}/`,
		"bodyClass": "wp-singular post-template-default single single-post postid-1950 single-format-standard wp-embed-responsive wp-theme-agenio angie-default ehf-header ehf-footer ehf-template-agenio ehf-stylesheet-agenio ally-default home-bg main-home onepage overflow-x-visible elementor-default elementor-kit-7",
		"date": entry.data.date
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Content", Content, {})}` })}`;
}, "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/pages/resources/blogs/resources/case-study/[slug].astro", void 0);
var $$file = "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/pages/resources/blogs/resources/case-study/[slug].astro";
var $$url = "/resources/blogs/resources/case-study/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/resources/blogs/resources/case-study/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
