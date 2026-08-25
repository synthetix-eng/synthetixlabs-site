//#region src/content/agent-docs/critic-agent.mdx?astroPropagatedAssets
async function getMod() {
	return import("./critic-agent_CekmFBXn.mjs");
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
