//#region src/content/agent-docs/conductor-agent.mdx?astroPropagatedAssets
async function getMod() {
	return import("./conductor-agent_DxstwhgB.mjs");
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
