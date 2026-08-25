//#region src/content/agent-docs/scout-agent.mdx?astroPropagatedAssets
async function getMod() {
	return import("./scout-agent_X8mevzRo.mjs");
}
var defaultMod = {
	__astroPropagation: true,
	getMod,
	collectedLinks: [],
	collectedStyles: [],
	collectedScripts: []
};
//#endregion
export { defaultMod as default };
