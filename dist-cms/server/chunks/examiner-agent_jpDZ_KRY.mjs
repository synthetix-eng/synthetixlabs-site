//#region src/content/agent-docs/examiner-agent.mdx?astroPropagatedAssets
async function getMod() {
	return import("./examiner-agent_CsPOPSXX.mjs");
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
