import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as setOnSetGetEnv, t as getEnv$1 } from "./runtime_x1Na2qzi.mjs";
import { makeGenericAPIRouteHandler } from "@keystatic/core/api/generic";
import { collection, config, fields } from "@keystatic/core";
//#region \0astro:env/server
/** @returns {string} */
var getEnv = (key) => {
	return getEnv$1(key);
};
var getSecret = (key) => {
	return getEnv(key);
};
setOnSetGetEnv(() => {});
//#endregion
//#region node_modules/@keystatic/astro/dist/keystatic-astro-api.js
function makeHandler(_config) {
	return async function keystaticAPIRoute(context) {
		var _config$clientId, _config$clientSecret, _config$secret;
		const { body, headers, status } = await makeGenericAPIRouteHandler({
			..._config,
			clientId: (_config$clientId = _config.clientId) !== null && _config$clientId !== void 0 ? _config$clientId : getSecret("KEYSTATIC_GITHUB_CLIENT_ID"),
			clientSecret: (_config$clientSecret = _config.clientSecret) !== null && _config$clientSecret !== void 0 ? _config$clientSecret : getSecret("KEYSTATIC_GITHUB_CLIENT_SECRET"),
			secret: (_config$secret = _config.secret) !== null && _config$secret !== void 0 ? _config$secret : getSecret("KEYSTATIC_SECRET")
		}, { slugEnvName: "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG" })(context.request);
		return new Response(body, {
			status,
			headers
		});
	};
}
//#endregion
//#region keystatic.config.ts
var storage = { kind: "cloud" };
var common = {
	excerpt: fields.text({
		label: "Excerpt",
		description: "One or two sentences. Used in listings and search results.",
		multiline: true,
		validation: { length: { min: 1 } }
	}),
	date: fields.date({
		label: "Published",
		validation: { isRequired: true }
	}),
	updated: fields.date({
		label: "Last updated",
		validation: { isRequired: true }
	}),
	draft: fields.checkbox({
		label: "Draft",
		description: "No page is generated at all. Use for content that has never been published.",
		defaultValue: false
	}),
	needsReview: fields.checkbox({
		label: "Needs review",
		description: "The page is still published, but flagged as having a known problem. Use this instead of Draft for anything already live — removing a live URL is worse than the problem on it.",
		defaultValue: false
	}),
	content: fields.mdx({ label: "Content" })
};
var keystatic_config_default = config({
	storage,
	cloud: { project: "synthetix/synthetixlabs-site" },
	ui: {
		brand: { name: "Synthetix Labs" },
		navigation: { Content: [
			"articles",
			"caseStudies",
			"agentDocs"
		] }
	},
	collections: {
		articles: collection({
			label: "Articles",
			path: "src/content/articles/*",
			slugField: "title",
			format: { contentField: "content" },
			entryLayout: "content",
			columns: ["title", "date"],
			schema: {
				title: fields.slug({ name: {
					label: "Title",
					description: "The URL is taken from this and should not change once published."
				} }),
				...common,
				tags: fields.array(fields.text({ label: "Tag" }), {
					label: "Tags",
					itemLabel: (p) => p.value
				}),
				author: fields.text({
					label: "Author",
					defaultValue: "nitin"
				})
			}
		}),
		caseStudies: collection({
			label: "Case studies",
			path: "src/content/case-studies/*",
			slugField: "title",
			format: { contentField: "content" },
			entryLayout: "content",
			columns: ["title", "date"],
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				...common
			}
		}),
		agentDocs: collection({
			label: "Agent documentation",
			path: "src/content/agent-docs/*",
			slugField: "title",
			format: { contentField: "content" },
			entryLayout: "content",
			columns: [
				"title",
				"agent",
				"date"
			],
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				agent: fields.text({
					label: "Agent",
					description: "Just the agent name, e.g. \"Scout\".",
					validation: { length: { min: 1 } }
				}),
				...common
			}
		})
	}
});
//#endregion
//#region node_modules/@keystatic/astro/internal/keystatic-api.js
var keystatic_api_exports = /* @__PURE__ */ __exportAll({
	ALL: () => ALL,
	all: () => all,
	prerender: () => false
});
var all = makeHandler({ config: keystatic_config_default });
var ALL = all;
//#endregion
//#region \0virtual:astro:page:node_modules/@keystatic/astro/internal/keystatic-api@_@js
var page = () => keystatic_api_exports;
//#endregion
export { page };
