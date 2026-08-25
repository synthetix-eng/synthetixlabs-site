//#region src/content/agent-docs/architect-agent.mdx?astroPropagatedAssets
async function getMod() {
	return import("./architect-agent_C0tGwVkw.mjs");
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
