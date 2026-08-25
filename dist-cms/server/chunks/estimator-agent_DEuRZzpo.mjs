//#region src/content/agent-docs/estimator-agent.mdx?astroPropagatedAssets
async function getMod() {
	return import("./estimator-agent_BHdsNHEY.mjs");
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
