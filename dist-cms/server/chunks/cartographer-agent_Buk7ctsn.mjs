//#region src/content/agent-docs/cartographer-agent.mdx?astroPropagatedAssets
async function getMod() {
	return import("./cartographer-agent_BOusG1NY.mjs");
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
