import { q as RenderUndefinedEntryError, t as AstroError, tt as UnknownContentCollectionError } from "./errors_Bwa88lUp.mjs";
import { A as createAstro, E as createHeadAndContent, O as unescapeHTML, S as addAttribute, U as generateCspDigest, a as renderScriptElement, d as renderComponent, g as renderSlot, i as spreadAttributes, o as renderUniqueStylesheet, p as Fragment, x as renderHead, y as renderTemplate } from "./jsx-runtime_DQm_vd0H.mjs";
import { d as prependForwardSlash, f as removeBase, l as isRemotePath } from "./path_ca21oV8k.mjs";
import { t as createComponent } from "./compiler_BQjKSGmA.mjs";
import { r as VALID_INPUT_FORMATS } from "./consts_DMslDGiP.mjs";
import * as z from "zod/v4";
import { escape } from "html-escaper";
import * as devalue from "devalue";
//#region node_modules/astro/dist/assets/runtime.js
function createSvgComponent({ meta, attributes, children, styles }) {
	const hasStyles = styles.length > 0;
	const Component = createComponent({
		async factory(result, props) {
			const normalizedProps = normalizeProps(attributes, props);
			if (hasStyles && result.cspDestination) for (const style of styles) {
				const hash = await generateCspDigest(style, result.cspAlgorithm);
				result._metadata.extraStyleHashes.push(hash);
			}
			return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
		},
		propagation: hasStyles ? "self" : "none"
	});
	Object.defineProperty(Component, "toJSON", {
		value: () => meta,
		enumerable: false
	});
	return Object.assign(Component, meta);
}
var ATTRS_TO_DROP = [
	"xmlns",
	"xmlns:xlink",
	"version"
];
var DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
	for (const attr of ATTRS_TO_DROP) delete attributes[attr];
	return attributes;
}
function normalizeProps(attributes, props) {
	return dropAttributes({
		...DEFAULT_ATTRS,
		...attributes,
		...props
	});
}
var CONTENT_IMAGE_FLAG = "astroContentImageFlag";
var DATA_STORE_VIRTUAL_ID = "astro:data-layer-content";
"" + DATA_STORE_VIRTUAL_ID;
var IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
`${DATA_STORE_VIRTUAL_ID}`;
//#endregion
//#region node_modules/astro/dist/assets/utils/resolveImports.js
function imageSrcToImportId(imageSrc, filePath) {
	imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
	if (isRemotePath(imageSrc)) return;
	const ext = imageSrc.split(".").at(-1)?.toLowerCase();
	if (!ext || !VALID_INPUT_FORMATS.includes(ext)) return;
	const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
	if (filePath) params.set("importer", filePath);
	return `${imageSrc}?${params.toString()}`;
}
//#endregion
//#region node_modules/astro/dist/core/build/incremental-content-collector.js
var COLLECTOR_KEY = /* @__PURE__ */ Symbol.for("astro:incremental-content-entries");
function collector() {
	const host = globalThis;
	let value = host[COLLECTOR_KEY];
	if (!value) {
		value = { current: void 0 };
		Object.defineProperty(host, COLLECTOR_KEY, {
			value,
			configurable: false,
			writable: false,
			enumerable: false
		});
	}
	return value;
}
function recordContentEntryRender(filePath) {
	if (!filePath) return;
	collector().current?.add(filePath);
}
//#endregion
//#region node_modules/astro/dist/content/data-store-source.js
var InMemorySource = class {
	#store;
	constructor(store) {
		this.#store = store;
	}
	hasCollection(collection) {
		return this.#store.hasCollection(collection);
	}
	get(collection, key) {
		return this.#store.get(collection, key);
	}
	entries(collection) {
		return this.#store.entries(collection);
	}
	values(collection) {
		return this.#store.values(collection);
	}
	keys(collection) {
		return this.#store.keys(collection);
	}
	has(collection, key) {
		return this.#store.has(collection, key);
	}
	collections() {
		return this.#store.collections();
	}
};
//#endregion
//#region node_modules/astro/dist/content/data-store.js
var ChunkedCollectionParser = class {
	#entries = /* @__PURE__ */ new Map();
	#remainder = "";
	add(part) {
		const records = (this.#remainder + part).split("\n");
		this.#remainder = records.pop();
		for (const record of records) {
			const parsed = devalue.parse(record);
			if (!Array.isArray(parsed) || parsed.length !== 2 || typeof parsed[0] !== "string") throw new Error("Invalid chunked data store entry");
			this.#entries.set(parsed[0], parsed[1]);
		}
	}
	finish() {
		if (this.#remainder) throw new Error("Invalid chunked data store entry");
		return this.#entries;
	}
};
var ImmutableDataStore = class ImmutableDataStore {
	_collections = /* @__PURE__ */ new Map();
	constructor() {
		this._collections = /* @__PURE__ */ new Map();
	}
	get(collectionName, key) {
		return this._collections.get(collectionName)?.get(String(key));
	}
	entries(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).entries()];
	}
	values(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).values()];
	}
	keys(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).keys()];
	}
	has(collectionName, key) {
		const collection = this._collections.get(collectionName);
		if (collection) return collection.has(String(key));
		return false;
	}
	hasCollection(collectionName) {
		return this._collections.has(collectionName);
	}
	collections() {
		return this._collections;
	}
	/**
	* Rebuilds a collections map from a chunked-store manifest whose part file
	* names have already been swapped for their contents.
	*
	* Each collection maps to a list of parts. A part is either a raw string
	* (when the store is loaded from disk) or an ESM namespace from a virtual
	* chunk import (`{ default: string }`, when emitted at runtime). Each part
	* contains independently serialized entry records. This is the inverse of
	* {@link import('./data-store-writer.js').ChunkedWriter} and stays free of
	* Node built-ins so it can run at runtime.
	*/
	static manifestToMap(manifest) {
		const collections = /* @__PURE__ */ new Map();
		for (const [collectionName, parts] of Object.entries(manifest)) {
			const parser = new ChunkedCollectionParser();
			for (const part of parts) parser.add(typeof part === "string" ? part : part.default);
			collections.set(collectionName, parser.finish());
		}
		return collections;
	}
	/**
	* Attempts to load a DataStore from the virtual module.
	* This only works in Vite.
	*/
	static async fromModule() {
		try {
			const data = await import("./_astro_data-layer-content_BDIcMJhg.mjs");
			if (data.default instanceof Map) return ImmutableDataStore.fromMap(data.default);
			if (Array.isArray(data.default)) {
				const map2 = devalue.unflatten(data.default);
				return ImmutableDataStore.fromMap(map2);
			}
			const map = ImmutableDataStore.manifestToMap(data.default);
			return ImmutableDataStore.fromMap(map);
		} catch {}
		return new ImmutableDataStore();
	}
	static async fromMap(data) {
		const store = new ImmutableDataStore();
		store._collections = data;
		return store;
	}
};
function dataStoreSingleton() {
	let instance = void 0;
	return {
		get: async () => {
			if (!instance) instance = ImmutableDataStore.fromModule().then((store) => new InMemorySource(store));
			return instance;
		},
		set: (store) => {
			instance = new InMemorySource(store);
		}
	};
}
var globalDataStore = dataStoreSingleton();
//#endregion
//#region node_modules/astro/dist/content/loaders/errors.js
function formatZodError(error) {
	return error.issues.map((issue) => `  **${issue.path.join(".")}**: ${issue.message}`);
}
var LiveCollectionError = class LiveCollectionError extends Error {
	collection;
	message;
	cause;
	constructor(collection, message, cause) {
		super(message);
		this.collection = collection;
		this.message = message;
		this.cause = cause;
		this.name = "LiveCollectionError";
		if (cause?.stack) this.stack = cause.stack;
	}
	static is(error) {
		return error instanceof LiveCollectionError;
	}
};
var LiveEntryNotFoundError = class extends LiveCollectionError {
	constructor(collection, entryFilter) {
		super(collection, `Entry ${collection} \u2192 ${typeof entryFilter === "string" ? entryFilter : JSON.stringify(entryFilter)} was not found.`);
		this.name = "LiveEntryNotFoundError";
	}
	static is(error) {
		return error?.name === "LiveEntryNotFoundError";
	}
};
var LiveCollectionValidationError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${collection} \u2192 ${entryId}** data does not match the collection schema.
`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionValidationError";
	}
	static is(error) {
		return error?.name === "LiveCollectionValidationError";
	}
};
var LiveCollectionCacheHintError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${String(collection)}${entryId ? ` \u2192 ${String(entryId)}` : ""}** returned an invalid cache hint.
`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionCacheHintError";
	}
	static is(error) {
		return error?.name === "LiveCollectionCacheHintError";
	}
};
//#endregion
//#region node_modules/astro/dist/content/runtime.js
var cacheHintSchema = z.object({
	tags: z.array(z.string()).optional(),
	lastModified: z.date().optional()
});
async function parseLiveEntry(entry, schema, collection) {
	try {
		const parsed = await z.safeParseAsync(schema, entry.data);
		if (!parsed.success) return { error: new LiveCollectionValidationError(collection, entry.id, parsed.error) };
		if (entry.cacheHint) {
			const cacheHint = cacheHintSchema.safeParse(entry.cacheHint);
			if (!cacheHint.success) return { error: new LiveCollectionCacheHintError(collection, entry.id, cacheHint.error) };
			entry.cacheHint = cacheHint.data;
		}
		return { entry: {
			...entry,
			data: parsed.data
		} };
	} catch (error) {
		return { error: new LiveCollectionError(collection, `Unexpected error parsing entry ${entry.id} in collection ${collection}`, error) };
	}
}
function createGetCollection({ liveCollections }) {
	return async function getCollection(collection, filter) {
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
		});
		const hasFilter = typeof filter === "function";
		const store = await globalDataStore.get();
		if (await store.hasCollection(collection)) {
			const { default: imageAssetMap } = await import("./content-assets_BNW1matP.mjs");
			const result = [];
			for (const rawEntry of await store.values(collection)) {
				const data = resolveEntryData(rawEntry, imageAssetMap);
				let entry = {
					...rawEntry,
					data,
					collection
				};
				if (hasFilter && !filter(entry)) continue;
				result.push(entry);
			}
			return result;
		} else {
			console.warn(`The collection ${JSON.stringify(collection)} does not exist or is empty. Please check your content config file for errors.`);
			return [];
		}
	};
}
function createGetEntry({ liveCollections }) {
	return async function getEntry(collectionOrLookupObject, lookup) {
		let collection, lookupId;
		if (typeof collectionOrLookupObject === "string") {
			collection = collectionOrLookupObject;
			if (!lookup) throw new AstroError({
				...UnknownContentCollectionError,
				message: "`getEntry()` requires an entry identifier as the second argument."
			});
			lookupId = lookup;
		} else {
			collection = collectionOrLookupObject.collection;
			lookupId = "id" in collectionOrLookupObject ? collectionOrLookupObject.id : collectionOrLookupObject.slug;
		}
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveEntry() instead of getEntry().`
		});
		if (typeof lookupId === "object") throw new AstroError({
			...UnknownContentCollectionError,
			message: `The entry identifier must be a string. Received object.`
		});
		const store = await globalDataStore.get();
		if (await store.hasCollection(collection)) {
			const entry = await store.get(collection, lookupId);
			if (!entry) {
				console.warn(`Entry ${collection} → ${lookupId} was not found.`);
				return;
			}
			const { default: imageAssetMap } = await import("./content-assets_BNW1matP.mjs");
			const data = resolveEntryData(entry, imageAssetMap);
			const result = {
				...entry,
				data,
				collection
			};
			warnForPropertyAccess(result.data, "slug", `[content] Attempted to access deprecated property on "${collection}" entry.
The "slug" property is no longer automatically added to entries. Please use the "id" property instead.`);
			warnForPropertyAccess(result, "render", `[content] Invalid attempt to access "render()" method on "${collection}" entry.
To render an entry, use "render(entry)" from "astro:content".`);
			return result;
		}
	};
}
function warnForPropertyAccess(entry, prop, message) {
	if (!(prop in entry)) {
		let _value = void 0;
		Object.defineProperty(entry, prop, {
			get() {
				if (_value === void 0) console.error(message);
				return _value;
			},
			set(v) {
				_value = v;
			},
			enumerable: false
		});
	}
}
function createGetLiveCollection({ liveCollections }) {
	return async function getLiveCollection(collection, filter) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveCollection() to load regular content collections.`) };
		try {
			const context = {
				filter,
				collection
			};
			const response = await liveCollections[collection].loader?.loadCollection?.(context);
			if (response && "error" in response) return { error: response.error };
			const { schema } = liveCollections[collection];
			let processedEntries = response.entries;
			if (schema) {
				const entryResults = await Promise.all(response.entries.map((entry) => parseLiveEntry(entry, schema, collection)));
				for (const result of entryResults) if (result.error) return { error: result.error };
				processedEntries = entryResults.map((result) => result.entry);
			}
			let cacheHint = response.cacheHint;
			if (cacheHint) {
				const cacheHintResult = cacheHintSchema.safeParse(cacheHint);
				if (!cacheHintResult.success) return { error: new LiveCollectionCacheHintError(collection, void 0, cacheHintResult.error) };
				cacheHint = cacheHintResult.data;
			}
			if (processedEntries.length > 0) {
				const entryTags = /* @__PURE__ */ new Set();
				let latestModified;
				for (const entry of processedEntries) if (entry.cacheHint) {
					if (entry.cacheHint.tags) entry.cacheHint.tags.forEach((tag) => entryTags.add(tag));
					if (entry.cacheHint.lastModified instanceof Date) {
						if (latestModified === void 0 || entry.cacheHint.lastModified > latestModified) latestModified = entry.cacheHint.lastModified;
					}
				}
				if (entryTags.size > 0 || latestModified || cacheHint) {
					const mergedCacheHint = {};
					if (cacheHint?.tags || entryTags.size > 0) mergedCacheHint.tags = [.../* @__PURE__ */ new Set([...cacheHint?.tags || [], ...entryTags])];
					if (cacheHint?.lastModified && latestModified) mergedCacheHint.lastModified = cacheHint.lastModified > latestModified ? cacheHint.lastModified : latestModified;
					else if (cacheHint?.lastModified || latestModified) mergedCacheHint.lastModified = cacheHint?.lastModified ?? latestModified;
					cacheHint = mergedCacheHint;
				}
			}
			return {
				entries: processedEntries,
				cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading collection ${collection}${error instanceof Error ? `: ${error.message}` : ""}`, error) };
		}
	};
}
function createGetLiveEntry({ liveCollections }) {
	return async function getLiveEntry(collection, lookup) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveEntry() to load regular content collections.`) };
		try {
			const lookupObject = {
				filter: typeof lookup === "string" ? { id: lookup } : lookup,
				collection
			};
			let entry = await liveCollections[collection].loader?.loadEntry?.(lookupObject);
			if (entry && "error" in entry) return { error: entry.error };
			if (!entry) return { error: new LiveEntryNotFoundError(collection, lookup) };
			const { schema } = liveCollections[collection];
			if (schema) {
				const result = await parseLiveEntry(entry, schema, collection);
				if (result.error) return { error: result.error };
				entry = result.entry;
			}
			return {
				entry,
				cacheHint: entry.cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading entry ${collection} → ${typeof lookup === "string" ? lookup : JSON.stringify(lookup)}`, error) };
		}
	};
}
var CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
async function updateImageReferencesInBody(html, fileName) {
	const { default: imageAssetMap } = await import("./content-assets_BNW1matP.mjs");
	const imageObjects = /* @__PURE__ */ new Map();
	const { getImage } = await import("./_virtual_astro_get-image_73TiczOH.mjs");
	for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) try {
		const decodedImagePath = JSON.parse(imagePath.replace(/&(?:#x22|quot);/g, "\"").replace(/&(?:#x27|apos);/g, "'"));
		let image;
		if (URL.canParse(decodedImagePath.src)) image = await getImage(decodedImagePath);
		else {
			const id = imageSrcToImportId(decodedImagePath.src, fileName);
			const imported = imageAssetMap.get(id);
			if (!id || imageObjects.has(id) || !imported) continue;
			image = await getImage({
				...decodedImagePath,
				src: imported
			});
		}
		imageObjects.set(imagePath, image);
	} catch {
		throw new Error(`Failed to parse image reference: ${imagePath}`);
	}
	return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
		const image = imageObjects.get(imagePath);
		if (!image) return full;
		const { index, ...attributes } = image.attributes;
		return Object.entries({
			...attributes,
			src: image.src,
			srcset: image.srcSet.attribute
		}).filter(([, value]) => value != null).map(([key, value]) => value === "" ? `${key}=""` : `${key}="${escape(String(value))}"`).join(" ");
	});
}
function resolveImageAtPath(src, fileName, imageAssetMap) {
	const id = imageSrcToImportId(src, fileName);
	if (!id) return;
	const imported = imageAssetMap?.get(id);
	if (!imported) return;
	if (imported.__svgData) {
		const { __svgData: svgData, ...meta } = imported;
		return createSvgComponent({
			meta,
			...svgData
		});
	}
	return imported;
}
function setAtPathCopying(target, path, value) {
	if (path.length === 0) return target;
	const [key, ...rest] = path;
	const copy = Array.isArray(target) ? target.slice() : { ...target };
	copy[key] = rest.length === 0 ? value : setAtPathCopying(copy[key], rest, value);
	return copy;
}
function updateImageReferencesInData(data, fileName, imageAssetMap, imageImports) {
	if (!imageImports?.length) return data;
	let result = data;
	for (const path of imageImports) {
		let src = result;
		for (const key of path) src = src?.[key];
		if (typeof src !== "string") continue;
		const resolved = resolveImageAtPath(src, fileName, imageAssetMap);
		if (resolved !== void 0) result = setAtPathCopying(result, path, resolved);
	}
	return result;
}
function resolveEntryData(entry, imageAssetMap) {
	return updateImageReferencesInData(entry.data, entry.filePath, imageAssetMap, entry.imageImports);
}
async function renderEntry(entry) {
	if (!entry) throw new AstroError(RenderUndefinedEntryError);
	recordContentEntryRender(entry.filePath);
	if (entry.deferredRender) try {
		const { default: contentModules } = await import("./content-modules_qFvpqgT3.mjs");
		const renderEntryImport = contentModules.get(entry.filePath);
		return render({
			collection: "",
			id: entry.id,
			renderEntryImport
		});
	} catch (e) {
		console.error(e);
	}
	const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
	return {
		Content: createComponent(() => renderTemplate`${unescapeHTML(html)}`),
		headings: entry?.rendered?.metadata?.headings ?? [],
		remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
	};
}
async function render({ collection, id, renderEntryImport }) {
	const UnexpectedRenderError = new AstroError({
		...UnknownContentCollectionError,
		message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
	});
	if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
	const baseMod = await renderEntryImport();
	if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
	const { default: defaultMod } = baseMod;
	if (isPropagatedAssetsModule(defaultMod)) {
		const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
		if (typeof getMod !== "function") throw UnexpectedRenderError;
		const propagationMod = await getMod();
		if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
		return {
			Content: createComponent({
				factory(result, baseProps, slots) {
					let styles = "", links = "", scripts = "";
					if (Array.isArray(collectedStyles)) styles = collectedStyles.map((style) => {
						return renderUniqueStylesheet(result, {
							type: "inline",
							content: style
						});
					}).join("");
					if (Array.isArray(collectedLinks)) links = collectedLinks.map((link) => {
						return renderUniqueStylesheet(result, {
							type: "external",
							src: isRemotePath(link) ? link : prependForwardSlash(link)
						});
					}).join("");
					if (Array.isArray(collectedScripts)) scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
					let props = baseProps;
					if (id.endsWith("mdx")) props = {
						components: propagationMod.components ?? {},
						...baseProps
					};
					return createHeadAndContent(unescapeHTML(styles + links + scripts), renderTemplate`${renderComponent(result, "Content", propagationMod.Content, props, slots)}`);
				},
				propagation: "self"
			}),
			headings: propagationMod.getHeadings?.() ?? [],
			remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
		};
	} else if (baseMod.Content && typeof baseMod.Content === "function") return {
		Content: baseMod.Content,
		headings: baseMod.getHeadings?.() ?? [],
		remarkPluginFrontmatter: baseMod.frontmatter ?? {}
	};
	else throw UnexpectedRenderError;
}
function isPropagatedAssetsModule(module) {
	return typeof module === "object" && module != null && "__astroPropagation" in module;
}
//#endregion
//#region \0astro:content
var liveCollections = {};
var getCollection = createGetCollection({ liveCollections });
createGetEntry({ liveCollections });
createGetLiveCollection({ liveCollections });
createGetLiveEntry({ liveCollections });
//#endregion
//#region src/layouts/shell/post-head.html?raw
var post_head_default = "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n	<link rel=\"profile\" href=\"http://gmpg.org/xfn/11\" />\n\n\n<!-- Google Tag Manager for WordPress by gtm4wp.com -->\n<script data-cfasync=\"false\" data-pagespeed-no-defer>\n	var gtm4wp_datalayer_name = \"dataLayer\";\n	var dataLayer = dataLayer || [];\n<\/script>\n<!-- End Google Tag Manager for WordPress by gtm4wp.com --><link rel='dns-prefetch' href='http://js.hs-scripts.com/' />\n<link rel='dns-prefetch' href='http://fonts.googleapis.com/' />\n<style id=\"wp-img-auto-sizes-contain-inline-css\">\nimg:is([sizes=auto i],[sizes^=\"auto,\" i]){contain-intrinsic-size:3000px 1500px}\n/*# sourceURL=wp-img-auto-sizes-contain-inline-css */\n</style>\n<link rel='stylesheet' id='hfe-widgets-style-css' href='/wp-content/plugins/header-footer-elementor/inc/widgets-css/frontend.css%3Fver=2.8.8.css' media='all' />\n<link rel='stylesheet' id='wp-block-library-css' href='/wp-includes/css/dist/block-library/style.min.css%3Fver=7.0.css' media='all' />\n<style id=\"wp-block-library-theme-inline-css\">\n.wp-block-audio :where(figcaption){color:#555;font-size:13px;text-align:center}.is-dark-theme .wp-block-audio :where(figcaption){color:#ffffffa6}.wp-block-audio{margin:0 0 1em}.wp-block-code{border:1px solid #ccc;border-radius:4px;font-family:Menlo,Consolas,monaco,monospace;padding:.8em 1em}.wp-block-embed :where(figcaption){color:#555;font-size:13px;text-align:center}.is-dark-theme .wp-block-embed :where(figcaption){color:#ffffffa6}.wp-block-embed{margin:0 0 1em}.blocks-gallery-caption{color:#555;font-size:13px;text-align:center}.is-dark-theme .blocks-gallery-caption{color:#ffffffa6}:root :where(.wp-block-image figcaption){color:#555;font-size:13px;text-align:center}.is-dark-theme :root :where(.wp-block-image figcaption){color:#ffffffa6}.wp-block-image{margin:0 0 1em}.wp-block-pullquote{border-bottom:4px solid;border-top:4px solid;color:currentColor;margin-bottom:1.75em}.wp-block-pullquote :where(cite),.wp-block-pullquote :where(footer),.wp-block-pullquote__citation{color:currentColor;font-size:.8125em;font-style:normal;text-transform:uppercase}.wp-block-quote{border-left:.25em solid;margin:0 0 1.75em;padding-left:1em}.wp-block-quote cite,.wp-block-quote footer{color:currentColor;font-size:.8125em;font-style:normal;position:relative}.wp-block-quote:where(.has-text-align-right){border-left:none;border-right:.25em solid;padding-left:0;padding-right:1em}.wp-block-quote:where(.has-text-align-center){border:none;padding-left:0}.wp-block-quote.is-large,.wp-block-quote.is-style-large,.wp-block-quote:where(.is-style-plain){border:none}.wp-block-search .wp-block-search__label{font-weight:700}.wp-block-search__button{border:1px solid #ccc;padding:.375em .625em}:where(.wp-block-group.has-background){padding:1.25em 2.375em}.wp-block-separator.has-css-opacity{opacity:.4}.wp-block-separator{border:none;border-bottom:2px solid;margin-left:auto;margin-right:auto}.wp-block-separator.has-alpha-channel-opacity{opacity:1}.wp-block-separator:not(.is-style-wide):not(.is-style-dots){width:100px}.wp-block-separator.has-background:not(.is-style-dots){border-bottom:none;height:1px}.wp-block-separator.has-background:not(.is-style-wide):not(.is-style-dots){height:2px}.wp-block-table{margin:0 0 1em}.wp-block-table td,.wp-block-table th{word-break:normal}.wp-block-table :where(figcaption){color:#555;font-size:13px;text-align:center}.is-dark-theme .wp-block-table :where(figcaption){color:#ffffffa6}.wp-block-video :where(figcaption){color:#555;font-size:13px;text-align:center}.is-dark-theme .wp-block-video :where(figcaption){color:#ffffffa6}.wp-block-video{margin:0 0 1em}:root :where(.wp-block-template-part.has-background){margin-bottom:0;margin-top:0;padding:1.25em 2.375em}\n/*# sourceURL=/wp-includes/css/dist/block-library/theme.min.css */\n</style>\n<style id=\"classic-theme-styles-inline-css\">\n/*! This file is auto-generated */\n.wp-block-button__link{color:#fff;background-color:#32373c;border-radius:9999px;box-shadow:none;text-decoration:none;padding:calc(.667em + 2px) calc(1.333em + 2px);font-size:1.125em}.wp-block-file__button{background:#32373c;color:#fff;text-decoration:none}\n/*# sourceURL=/wp-includes/css/classic-themes.min.css */\n</style>\n<style id=\"global-styles-inline-css\">\n:root{--wp--preset--aspect-ratio--square: 1;--wp--preset--aspect-ratio--4-3: 4/3;--wp--preset--aspect-ratio--3-4: 3/4;--wp--preset--aspect-ratio--3-2: 3/2;--wp--preset--aspect-ratio--2-3: 2/3;--wp--preset--aspect-ratio--16-9: 16/9;--wp--preset--aspect-ratio--9-16: 9/16;--wp--preset--color--black: #000000;--wp--preset--color--cyan-bluish-gray: #abb8c3;--wp--preset--color--white: #ffffff;--wp--preset--color--pale-pink: #f78da7;--wp--preset--color--vivid-red: #cf2e2e;--wp--preset--color--luminous-vivid-orange: #ff6900;--wp--preset--color--luminous-vivid-amber: #fcb900;--wp--preset--color--light-green-cyan: #7bdcb5;--wp--preset--color--vivid-green-cyan: #00d084;--wp--preset--color--pale-cyan-blue: #8ed1fc;--wp--preset--color--vivid-cyan-blue: #0693e3;--wp--preset--color--vivid-purple: #9b51e0;--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple: linear-gradient(135deg,rgb(6,147,227) 0%,rgb(155,81,224) 100%);--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan: linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%);--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange: linear-gradient(135deg,rgb(252,185,0) 0%,rgb(255,105,0) 100%);--wp--preset--gradient--luminous-vivid-orange-to-vivid-red: linear-gradient(135deg,rgb(255,105,0) 0%,rgb(207,46,46) 100%);--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray: linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%);--wp--preset--gradient--cool-to-warm-spectrum: linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%);--wp--preset--gradient--blush-light-purple: linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%);--wp--preset--gradient--blush-bordeaux: linear-gradient(135deg,rgb(254,205,165) 0%,rgb(254,45,45) 50%,rgb(107,0,62) 100%);--wp--preset--gradient--luminous-dusk: linear-gradient(135deg,rgb(255,203,112) 0%,rgb(199,81,192) 50%,rgb(65,88,208) 100%);--wp--preset--gradient--pale-ocean: linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%);--wp--preset--gradient--electric-grass: linear-gradient(135deg,rgb(202,248,128) 0%,rgb(113,206,126) 100%);--wp--preset--gradient--midnight: linear-gradient(135deg,rgb(2,3,129) 0%,rgb(40,116,252) 100%);--wp--preset--font-size--small: 13px;--wp--preset--font-size--medium: 20px;--wp--preset--font-size--large: 36px;--wp--preset--font-size--x-large: 42px;--wp--preset--spacing--20: 0.44rem;--wp--preset--spacing--30: 0.67rem;--wp--preset--spacing--40: 1rem;--wp--preset--spacing--50: 1.5rem;--wp--preset--spacing--60: 2.25rem;--wp--preset--spacing--70: 3.38rem;--wp--preset--spacing--80: 5.06rem;--wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, 0.2);--wp--preset--shadow--deep: 12px 12px 50px rgba(0, 0, 0, 0.4);--wp--preset--shadow--sharp: 6px 6px 0px rgba(0, 0, 0, 0.2);--wp--preset--shadow--outlined: 6px 6px 0px -3px rgb(255, 255, 255), 6px 6px rgb(0, 0, 0);--wp--preset--shadow--crisp: 6px 6px 0px rgb(0, 0, 0);}:where(body) { margin: 0; }:where(.is-layout-flex){gap: 0.5em;}:where(.is-layout-grid){gap: 0.5em;}body .is-layout-flex{display: flex;}.is-layout-flex{flex-wrap: wrap;align-items: center;}.is-layout-flex > :is(*, div){margin: 0;}body .is-layout-grid{display: grid;}.is-layout-grid > :is(*, div){margin: 0;}body{padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;}:root :where(.wp-element-button, .wp-block-button__link){background-color: #32373c;border-width: 0;color: #fff;font-family: inherit;font-size: inherit;font-style: inherit;font-weight: inherit;letter-spacing: inherit;line-height: inherit;padding-top: calc(0.667em + 2px);padding-right: calc(1.333em + 2px);padding-bottom: calc(0.667em + 2px);padding-left: calc(1.333em + 2px);text-decoration: none;text-transform: inherit;}.has-black-color{color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-color{color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-color{color: var(--wp--preset--color--white) !important;}.has-pale-pink-color{color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-color{color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-color{color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-color{color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-color{color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-color{color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-color{color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-color{color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-color{color: var(--wp--preset--color--vivid-purple) !important;}.has-black-background-color{background-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-background-color{background-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-background-color{background-color: var(--wp--preset--color--white) !important;}.has-pale-pink-background-color{background-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-background-color{background-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-background-color{background-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-background-color{background-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-background-color{background-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-background-color{background-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-background-color{background-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-background-color{background-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-background-color{background-color: var(--wp--preset--color--vivid-purple) !important;}.has-black-border-color{border-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-border-color{border-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-border-color{border-color: var(--wp--preset--color--white) !important;}.has-pale-pink-border-color{border-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-border-color{border-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-border-color{border-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-border-color{border-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-border-color{border-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-border-color{border-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-border-color{border-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-border-color{border-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-border-color{border-color: var(--wp--preset--color--vivid-purple) !important;}.has-vivid-cyan-blue-to-vivid-purple-gradient-background{background: var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple) !important;}.has-light-green-cyan-to-vivid-green-cyan-gradient-background{background: var(--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan) !important;}.has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange) !important;}.has-luminous-vivid-orange-to-vivid-red-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-orange-to-vivid-red) !important;}.has-very-light-gray-to-cyan-bluish-gray-gradient-background{background: var(--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray) !important;}.has-cool-to-warm-spectrum-gradient-background{background: var(--wp--preset--gradient--cool-to-warm-spectrum) !important;}.has-blush-light-purple-gradient-background{background: var(--wp--preset--gradient--blush-light-purple) !important;}.has-blush-bordeaux-gradient-background{background: var(--wp--preset--gradient--blush-bordeaux) !important;}.has-luminous-dusk-gradient-background{background: var(--wp--preset--gradient--luminous-dusk) !important;}.has-pale-ocean-gradient-background{background: var(--wp--preset--gradient--pale-ocean) !important;}.has-electric-grass-gradient-background{background: var(--wp--preset--gradient--electric-grass) !important;}.has-midnight-gradient-background{background: var(--wp--preset--gradient--midnight) !important;}.has-small-font-size{font-size: var(--wp--preset--font-size--small) !important;}.has-medium-font-size{font-size: var(--wp--preset--font-size--medium) !important;}.has-large-font-size{font-size: var(--wp--preset--font-size--large) !important;}.has-x-large-font-size{font-size: var(--wp--preset--font-size--x-large) !important;}\n:root :where(.wp-block-icon svg){width: 24px;}\n:where(.wp-block-post-template.is-layout-flex){gap: 1.25em;}:where(.wp-block-post-template.is-layout-grid){gap: 1.25em;}\n:where(.wp-block-term-template.is-layout-flex){gap: 1.25em;}:where(.wp-block-term-template.is-layout-grid){gap: 1.25em;}\n:where(.wp-block-columns.is-layout-flex){gap: 2em;}:where(.wp-block-columns.is-layout-grid){gap: 2em;}\n:root :where(.wp-block-pullquote){font-size: 1.5em;line-height: 1.6;}\n/*# sourceURL=global-styles-inline-css */\n</style>\n<link rel='stylesheet' id='hfe-style-css' href='/wp-content/plugins/header-footer-elementor/assets/css/header-footer-elementor.css%3Fver=2.8.8.css' media='all' />\n<link rel='stylesheet' id='elementor-frontend-css' href='/wp-content/plugins/elementor/assets/css/frontend.min.css%3Fver=4.1.3.css' media='all' />\n<style id=\"elementor-frontend-inline-css\">\n.e-heading-base a, .e-paragraph-base a { all: unset; cursor: pointer; }form[data-element_type=\"e-form\"].form-state-success [data-element_type=\"e-form-success-message\"],form[data-element_type=\"e-form\"].form-state-error [data-element_type=\"e-form-error-message\"]{ display: block; }\n/*# sourceURL=elementor-frontend-inline-css */\n</style>\n<link rel='stylesheet' id='elementor-post-7-css' href='/wp-content/uploads/elementor/css/post-7.css%3Fver=1786471327.css' media='all' />\n<link rel='stylesheet' id='base-desktop-css' href='/wp-content/uploads/elementor/css/base-desktop.css%3Fver=6a7b639fc7b4e.css' media='all' />\n<link rel='stylesheet' id='local-46-frontend-desktop-css' href='/wp-content/uploads/elementor/css/local-46-frontend-desktop.css%3Fver=6a7b639fcb7f6.css' media='all' />\n<link rel='stylesheet' id='elementor-post-60-css' href='/wp-content/uploads/elementor/css/post-60.css%3Fver=1786471328.css' media='all' />\n<link rel='stylesheet' id='elementor-post-46-css' href='/wp-content/uploads/elementor/css/post-46.css%3Fver=1786471328.css' media='all' />\n<link rel='stylesheet' id='elementor-post-290-css' href='/wp-content/uploads/elementor/css/post-290.css%3Fver=1786471328.css' media='all' />\n<link rel='stylesheet' id='agenio-fonts-css' href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&#038;family=Urbanist:ital,wght@0,100..900;1,100..900&#038;display=swap' media='all' />\n<link rel='stylesheet' id='swiper-css' href='/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css%3Fver=8.4.5.css' media='all' />\n<link rel='stylesheet' id='metismenu-css' href='/wp-content/themes/agenio/assets/css/plugins/metismenu.css' media='all' />\n<link rel='stylesheet' id='bootstrap-css' href='/wp-content/themes/agenio/assets/css/vendor/bootstrap.min.css' media='all' />\n<link rel='stylesheet' id='animate-css' href='/wp-content/themes/agenio/assets/css/vendor/animate.css' media='all' />\n<link rel='stylesheet' id='odometer-css' href='/wp-content/themes/agenio/assets/css/plugins/odometer.css' media='all' />\n<link rel='stylesheet' id='fontawesome-css' href='/wp-content/themes/agenio/assets/css/plugins/fontawesome.min.css' media='all' />\n<link rel='stylesheet' id='agenio-unittest-css' href='/wp-content/themes/agenio/assets/css/wordpress-unit-test.css' media='all' />\n<link rel='stylesheet' id='agenio-style-css' href='/wp-content/themes/agenio/assets/css/style.css' media='all' />\n<link rel='stylesheet' id='hfe-elementor-icons-css' href='/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css%3Fver=5.34.0.css' media='all' />\n<link rel='stylesheet' id='hfe-icons-list-css' href='/wp-content/plugins/elementor/assets/css/widget-icon-list.min.css%3Fver=3.24.3.css' media='all' />\n<link rel='stylesheet' id='hfe-social-icons-css' href='/wp-content/plugins/elementor/assets/css/widget-social-icons.min.css%3Fver=3.24.0.css' media='all' />\n<link rel='stylesheet' id='hfe-social-share-icons-brands-css' href='/wp-content/plugins/elementor/assets/lib/font-awesome/css/brands.css%3Fver=5.15.3.css' media='all' />\n<link rel='stylesheet' id='hfe-social-share-icons-fontawesome-css' href='/wp-content/plugins/elementor/assets/lib/font-awesome/css/fontawesome.css%3Fver=5.15.3.css' media='all' />\n<link rel='stylesheet' id='hfe-nav-menu-icons-css' href='/wp-content/plugins/elementor/assets/lib/font-awesome/css/solid.css%3Fver=5.15.3.css' media='all' />\n<link rel='stylesheet' id='eael-general-css' href='/wp-content/plugins/essential-addons-for-elementor-lite/assets/front-end/css/view/general.min.css%3Fver=6.6.11.css' media='all' />\n<link rel='stylesheet' id='elementor-gf-roboto-css' href='https://fonts.googleapis.com/css?family=Roboto:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&#038;display=swap' media='all' />\n<link rel='stylesheet' id='elementor-gf-robotoslab-css' href='https://fonts.googleapis.com/css?family=Roboto+Slab:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&#038;display=swap' media='all' />\n<script id=\"jquery-core-js\" src=\"/wp-includes/js/jquery/jquery.min.js\"><\/script>\n<script id=\"jquery-migrate-js\" src=\"/wp-includes/js/jquery/jquery-migrate.min.js\"><\/script>\n<script id=\"jquery-js-after\">\nvar $ = jQuery.noConflict();\n!function($){\"use strict\";$(document).ready(function(){$(this).scrollTop()>100&&$(\".hfe-scroll-to-top-wrap\").removeClass(\"hfe-scroll-to-top-hide\"),$(window).scroll(function(){$(this).scrollTop()<100?$(\".hfe-scroll-to-top-wrap\").fadeOut(300):$(\".hfe-scroll-to-top-wrap\").fadeIn(300)}),$(\".hfe-scroll-to-top-wrap\").on(\"click\",function(){$(\"html, body\").animate({scrollTop:0},300);return!1})})}(jQuery);\n!function($){'use strict';$(document).ready(function(){var bar=$('.hfe-reading-progress-bar');if(!bar.length)return;$(window).on('scroll',function(){var s=$(window).scrollTop(),d=$(document).height()-$(window).height(),p=d? s/d*100:0;bar.css('width',p+'%')});});}(jQuery);\n//# sourceURL=jquery-js-after\n<\/script>\n\n			<!-- DO NOT COPY THIS SNIPPET! Start of Page Analytics Tracking for HubSpot WordPress plugin v11.3.51-->\n			<script class=\"hsq-set-content-id\" data-content-id=\"blog-post\">\n				var _hsq = _hsq || [];\n				_hsq.push([\"setContentType\", \"blog-post\"]);\n			<\/script>\n			<!-- DO NOT COPY THIS SNIPPET! End of Page Analytics Tracking for HubSpot WordPress plugin -->\n			\n<!-- Google Tag Manager for WordPress by gtm4wp.com -->\n<!-- GTM Container placement set to automatic -->\n<script data-cfasync=\"false\" data-pagespeed-no-defer>\n	var dataLayer_content = {\"pagePostType\":\"post\",\"pagePostType2\":\"single-post\",\"pageCategory\":[\"uncategorized\"],\"pageAttributes\":[\"agentic-ai\"],\"pagePostAuthor\":\"Nitin Sinha\"};\n	dataLayer.push( dataLayer_content );\n<\/script>\n<script data-cfasync=\"false\" data-pagespeed-no-defer>\n(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','GTM-57L5SRZP');\n<\/script>\n<!-- End Google Tag Manager for WordPress by gtm4wp.com -->\n			<style>\n				.e-con.e-parent:nth-of-type(n+4):not(.e-lazyloaded):not(.e-no-lazyload),\n				.e-con.e-parent:nth-of-type(n+4):not(.e-lazyloaded):not(.e-no-lazyload) * {\n					background-image: none !important;\n				}\n				@media screen and (max-height: 1024px) {\n					.e-con.e-parent:nth-of-type(n+3):not(.e-lazyloaded):not(.e-no-lazyload),\n					.e-con.e-parent:nth-of-type(n+3):not(.e-lazyloaded):not(.e-no-lazyload) * {\n						background-image: none !important;\n					}\n				}\n				@media screen and (max-height: 640px) {\n					.e-con.e-parent:nth-of-type(n+2):not(.e-lazyloaded):not(.e-no-lazyload),\n					.e-con.e-parent:nth-of-type(n+2):not(.e-lazyloaded):not(.e-no-lazyload) * {\n						background-image: none !important;\n					}\n				}\n			</style>\n			<link rel=\"icon\" href=\"/wp-content/uploads/2026/07/cropped-Synthetix_Favicon_512-32x32.png\" sizes=\"32x32\" />\n<link rel=\"icon\" href=\"/wp-content/uploads/2026/07/cropped-Synthetix_Favicon_512-192x192.png\" sizes=\"192x192\" />\n<link rel=\"apple-touch-icon\" href=\"/wp-content/uploads/2026/07/cropped-Synthetix_Favicon_512-180x180.png\" />\n<meta name=\"msapplication-TileImage\" content=\"/wp-content/uploads/2026/07/cropped-Synthetix_Favicon_512-270x270.png\" />\n<style id=\"wp-custom-css\">\n.single-approach-area-start p.disc {\n    color: #74787C;\n    width: 82%;\n}\n.project-wrapper2 .image-area .over-link {\n  pointer-events: none;\n}\nul li a:hover {\n    color: #0A47C9!important;\n}\n.single-approach-area-start:nth-of-type(4)::after {\n    content: \"04\";\n}\n.single-approach-area-start:nth-of-type(5)::after {\n    content: \"05\";\n}\n#governance> .elementor-widget> .elementor-widget-container> .wpr-service-extended-area .service-tags-row, #governance> .elementor-widget> .elementor-widget-container> .wpr-service-extended-area .service-images-row, #governance> .elementor-widget> .elementor-widget-container> .wpr-service-extended-area .service-what-we-do, #governance> .elementor-widget> .elementor-widget-container> .wpr-service-extended-area .service-included  {\n  display: none;\n}\n\n#agentpage>.elementor-widget-container> .wpr-service-extended-area .service-tags-row, #agentpage> .elementor-widget-container> .wpr-service-extended-area .service-images-row, #agentpage> .elementor-widget-container> .wpr-service-extended-area .service-deliverables, #agentpage> .elementor-widget-container> .wpr-service-extended-area .service-included  {\n  display: none;\n}\n\n#whysynthetix> .elementor-widget-container> .services-details-banner .section-inner .image-area, \n#whysynthetix> .elementor-widget-container> .services-details-banner .section-inner .service-overview .wpr-service-details-content .feature-wrapper-area  {\n   display: none;\n}\n#last-footer {\n  display: none;\n}\n.why-choose-wrapper.ml-auto {\n    height: -webkit-fill-available;\n}\n.section-title-area .sub-title::after {\n    background: #0A47C9;\n}\n.wpr-btn.with-icon .icon {\n    background: linear-gradient(178.82deg, #3E7FE8 1.01%, #3AC8D5 105.12%);\nbox-shadow: 4px 8px 2px rgba(0, 0, 0, 0.08), inset 0px -2px 0.5px #3E7FE8, inset 0px 1px 0px #FFFFFF;\n}\n\n.team-apply-wrapper .top-content .square-dot {\n    background: #67DCE4;\n}\n.wpr-services-area .section-bottom-content .service-wrapper .content .top .tag::after, .wpr-cta-area .section-inner .section-bottom-shape .tag::after,.wpr-contact-area .section-inner .left-content-area .location-area .sub-title::after,.wpr-contact-area .section-inner .left-content-area .get-in-touch .sub-title::after {\n    background: #3AC8D5;\n}\n.wpr-faq-area .section-inner .section-content-area .accordion-one .accordion-header button::after,.wpr-contact-area .section-inner .contact-form-area form .single-input.last label i,.toggle  {\n  color: #3AC8D5!important; \n}\n.wpr-services-area .section-bottom-content .service-wrapper .content .bottom ul {\n    border-left: 2px solid #3AC8D5;\n}\n#goTop .border-progress {\n    position: absolute;\n    top: -1px;\n    left: -1px;\n    width: calc(100% + 2px);\n    height: calc(100% + 2px);\n    mask-image: conic-gradient(var(--color-primary) var(--progress-angle, 0deg), transparent 0);\n    content: \"\";\n    z-index: 1;\n    border-radius: 99px;\n    border: 2px solid #0A47C9;\n    transition: var(--transition);\n}\n.header-style-one .header-top{\n  display: none;\n}\n.icon {\n  width: 80px;\n}\n#hidecrousel {\n  display: none;\n}\n.service-wrapper.image-area .image-area img  {\n  height: 100%;\n}\n#startwithhide {\n display: none;\n}\n.why-choose-wrapper{\n    background: #0000002e;\n    box-shadow: rgb(255 255 255 / 0%) 0px 1px 0px inset, rgb(228, 228, 228) 0px -5px 0px inset, rgb(250, 250, 250) 0px -1px 0px 1px inset;\n}\n#platformdemo {\n  display: none;\n}\n.wpr-service-extended-area .service-deliverables .deliverable-card .deliverable-number {\n  color: #3E7FE8;\n}\n.why-choose-wrapper {\n	background: #FFFFFF;\n}\n#whysynthetixpage> .elementor-widget-container> .wpr-why-choose-us-area .wpr-content-area {\n background: #eeeeee;\n}\n.elementor-element-89d5198 {\n	display: contents;\n}\n.elementor-element-89d5198 .button-area {\n    display: inline-flex;\n    justify-content: center;\n}\n.elementor-element-89d5198 .button-area .wpr-btn.btn-white {\n	margin-right: 15px;\n}\n.wrapper-list .two {\n	background: #F7F7F7;\n}\n .wpr-why-choose-us-area .wpr-content-area {\n	background: #eeeeee;\n}\n.why-choose-wrapper .wrapper-header.two{\n	background: #fff;\n}\nli> img {\n	width: 20px;\n}\n.wpr-service-extended-area .service-what-we-do .service-what-left .sub-title::before, .wpr-service-extended-area .service-deliverables .service-deliverables-header .sub-title::before {\n  background: #0A47C9;\n}\n.wpr-banner-area .banner-content-area .bg-shape img {\n display: none;\n}\n.square-shape.top-left, .square-shape.bottom-left, .square-shape.top-right, .square-shape.bottom-right {\n display: none;\n}\n.header-style-one .header-style-one-wrapper .left-area {\n    padding: 5px 30px 5px;\n	  border-right: 0px;\n}\n.left-area .logo-area {\n    width: 230px;\n    height: 30px;\n	  display: contents;\n}\n.left-area .logo-area img {\n   height: 65px!important;\n}\n.services-details-banner .section-inner .service-overview .approach-area .left ul li svg path {\n    fill: #0A47C9;\n}\n.elementor-element-4310816 > div {\n    width: 82% !important;\n    max-width: 82% !important;\n}\n.stx-heading,.stx-subheading,.stx-tagline {\n font-family: var(--font-secondary)!important;\n}\n\n#blogId .eael-grid-post-holder-inner{\n	    display: flex;\n    flex-direction: row;\n	    align-items: center;\n}\n.one, .two{\n	display:none;\n}\n.blog-diops > div{\n	height:100%;\n}\n.blog-diops img{\n	height:200px;\n	object-fit:cover;\n}\n.middle-set{\n	margin:10px 0;\n}\n#blogId .eael-entry-media{\n	width:40%;\n}\n#blogId .eael-entry-wrapper{\n	width:60%;\n}\n#blogId .eael-entry-media{\n	height:100%;\n	object-fit:cover;\n}\n.button-area a:hover{\n	color:#000;\n}\n.blog-single-wrap h1 strong, .blog-single-wrap h2 strong ,.blog-single-wrap h3 strong, .blog-single-wrap h4 strong, .blog-single-wrap a, .blog-single-wrap p, .blog-single-wrap strong, .blog-single-wrap ul, .blog-single-wrap li, .blog-single-wrap span{\n	color:#6B7280;\n}\n#why-sp .product-intro a:hover{\n	color:#fff !important;\n}\n@media only screen and (max-width: 768px) {\n		#blogId .eael-grid-post-holder-inner{\n		display:block !important;\n	}\n	#blogId .eael-entry-media{\n	width:100%!important;;\n}\n#blogId .eael-entry-wrapper{\n	width:100%!important;;\n}\n}\n\n#governance .wpr-services-area .section-bottom-content .service-wrapper .content .bottom .service-btn-area {\n  display: none;\n}\n\n/* Footer CSS */\n\n.cf-bottom {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 20px;\n    padding: 20px 0;\n}\n.cf-copyright {\n    margin: 0;\n	  font-size: 14px;\n}\n.cf-legal {\n    display: flex;\n    align-items: center;\n    gap: 24px;\n}\n.cf-legal a {\n    text-decoration: none;\n    color: inherit;\n    font-size: 14px;\n}\n@media (max-width: 768px) {\n    .cf-bottom {\n        flex-direction: column;\n        align-items: center;\n        text-align: center;\n    }\n    .cf-legal {\n        flex-wrap: wrap;\n        justify-content: center;\n    }\n}\n.wpr-contact-area .section-inner .left-content-area .location-area ul li .h4 {\n  font-size: 20px!important;\n} \n</style>\n";
//#endregion
//#region src/layouts/shell/post-a.html?raw
var post_a_default = "<!-- GTM Container placement set to automatic -->\n<!-- Google Tag Manager (noscript) -->\n				<noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id=GTM-57L5SRZP\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\" aria-hidden=\"true\"></iframe></noscript>\n<!-- End Google Tag Manager (noscript) -->\n                <!-- Preload -->\n        <div class=\"preloader overflow-hidden\">\n            <div class=\"site-name\"><span>SYNTHETIX</span></div>\n            <div class=\"preloader-gutters\">\n                                <div class=\"bar\">\n                    <div class=\"inner-bar\"></div>\n                </div>\n                                <div class=\"bar\">\n                    <div class=\"inner-bar\"></div>\n                </div>\n                                <div class=\"bar\">\n                    <div class=\"inner-bar\"></div>\n                </div>\n                                <div class=\"bar\">\n                    <div class=\"inner-bar\"></div>\n                </div>\n                                <div class=\"bar\">\n                    <div class=\"inner-bar\"></div>\n                </div>\n                                <div class=\"bar\">\n                    <div class=\"inner-bar\"></div>\n                </div>\n                                <div class=\"bar\">\n                    <div class=\"inner-bar\"></div>\n                </div>\n                                <div class=\"bar\">\n                    <div class=\"inner-bar\"></div>\n                </div>\n                            </div>\n        </div>\n        <!-- /Preload -->\n        \n                    <button id=\"goTop\" class=\"show\">\n            <span class=\"border-progress\" style=\"--progress-angle: 360deg;\"></span>\n            <span class=\"ic-wrap\">\n            <span class=\"icon icon-long-arrow-alt-up-solid\"><i class=\"fa-sharp fa-regular fa-arrow-up-long\"></i></span>\n            </span>\n            </button>\n        \n    <div id=\"page\" class=\"hfeed site\">\n\n		<header id=\"masthead\" itemscope=\"itemscope\" itemtype=\"https://schema.org/WPHeader\">\n			<p class=\"main-title bhf-hidden\" itemprop=\"headline\"><a href=\"/\" title=\"Synthetix Labs\" rel=\"home\">Synthetix Labs</a></p>\n			<style>.elementor-60 .elementor-element.elementor-element-6bb6f96{--display:flex;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}</style>		<div data-elementor-type=\"wp-post\" data-elementor-id=\"60\" class=\"elementor elementor-60\">\n				<div class=\"elementor-element elementor-element-6bb6f96 e-con-full e-flex e-con e-parent\" data-id=\"6bb6f96\" data-element_type=\"container\" data-e-type=\"container\">\n				<div class=\"elementor-element elementor-element-f82ba4f elementor-widget elementor-widget-agenio_header_widget\" data-id=\"f82ba4f\" data-element_type=\"widget\" data-e-type=\"widget\" data-widget_type=\"agenio_header_widget.default\">\n				<div class=\"elementor-widget-container\">\n					        <!-- header area start -->\n        <header class=\"header-style-one\">\n\n                        <!-- Top Bar -->\n            <div class=\"header-top\">\n                <div class=\"header-top-inner\">\n                    <div class=\"left-icon\">\n                        <img src=\"/wp-content/themes/agenio/assets/images/icon/green-left.svg\" alt=\"\">\n                    </div>\n                    <p class=\"text\">\n                        WE ARE AVAILABLE FOR                        <span>DECEMBER PROJECTS</span>\n                    </p>\n                    <div class=\"right-icon\">\n                        <img src=\"/wp-content/themes/agenio/assets/images/icon/green-right.svg\" alt=\"\">\n                    </div>\n                </div>\n            </div>\n            \n            <div class=\"container\">\n                <div class=\"header-style-one-wrapper\">\n\n                    <!-- Logo -->\n                    <div class=\"left-area square-dot\">\n                        <div class=\"logo-area\">\n                            <a href=\"/\" class=\"logo\">\n                                <img src=\"/wp-content/uploads/2026/05/logo-new.png\" alt=\"Synthetix Labs\">\n                            </a>\n                        </div>\n                        <span class=\"square-shape top-left\"></span>\n                        <span class=\"square-shape bottom-left\"></span>\n                        <span class=\"square-shape top-right\"></span>\n                        <span class=\"square-shape bottom-right\"></span>\n                    </div>\n\n                    <!-- Desktop Nav -->\n                    <nav class=\"main-nav-area\">\n                        <ul id=\"menu-main-menu\" class=\"list-unstyled wpr-desktop-menu\"><li class=\"menu-item\"><a href=\"/solutions/\" class=\"main-element\">Solutions</a></li><li class=\"menu-item\"><a href=\"/platform/\" class=\"main-element\">Platform</a></li><li class=\"menu-item\"><a href=\"/agents/\" class=\"main-element\">Agents</a></li><li class=\"menu-item\"><a href=\"/governance/\" class=\"main-element\">Governance</a></li><li class=\"menu-item\"><a href=\"/why-synthetix/\" class=\"main-element\">Why Synthetix</a></li><li class=\"menu-item\"><a href=\"/company/\" class=\"main-element\">Company</a></li><li class=\"menu-item\"><a href=\"/resources/\" class=\"main-element\">Resources</a></li></ul>                    </nav>\n\n                    <!-- CTA Button + Hamburger -->\n                    <div class=\"button-area-start square-dot\">\n                        <a href=\"/contact/\" class=\"wpr-btn btn-primary\">\n                            Contact Us                        </a>\n                        <div class=\"menu-btn d-flex d-lg-none d-md-flex d-sm-flex\" id=\"menu-btn\">\n                            <span class=\"line one\"></span>\n                            <span class=\"line two\"></span>\n                        </div>\n                        <span class=\"square-shape top-left\"></span>\n                        <span class=\"square-shape bottom-left\"></span>\n                        <span class=\"square-shape top-right\"></span>\n                        <span class=\"square-shape bottom-right\"></span>\n                    </div>\n\n                    <!-- Mobile Sidebar -->\n                    <div id=\"side-bar\" class=\"side-bar\">\n                        <div class=\"sidebar-inner\">\n                            <div class=\"mobile-menu-main\">\n                                <nav class=\"nav-main mainmenu-nav\">\n                                    <ul id=\"mobile-menu\" class=\"list-unstyled wpr-desktop-menu\"><li class=\"menu-item\"><a class=\"main-element\" href=\"/solutions/\">Solutions</a></li><li class=\"menu-item\"><a class=\"main-element\" href=\"/platform/\">Platform</a></li><li class=\"menu-item\"><a class=\"main-element\" href=\"/agents/\">Agents</a></li><li class=\"menu-item\"><a class=\"main-element\" href=\"/governance/\">Governance</a></li><li class=\"menu-item\"><a class=\"main-element\" href=\"/why-synthetix/\">Why Synthetix</a></li><li class=\"menu-item\"><a class=\"main-element\" href=\"/company/\">Company</a></li><li class=\"menu-item\"><a class=\"main-element\" href=\"/resources/\">Resources</a></li></ul>                                </nav>\n                            </div>\n                            <div class=\"button-area\">\n                                <a href=\"/contact/\" class=\"wpr-btn btn-primary\">\n                                    Contact                                </a>\n                            </div>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n        </header>\n        <!-- header area end -->\n        				</div>\n				</div>\n				</div>\n				</div>\n				</header>\n\n	\n<!-- wpr banner area start -->\n<section class=\"wpr-banner-area breadcrumb\">\n    <div class=\"container\">\n        <div class=\"banner-content-area\">\n";
//#endregion
//#region src/layouts/shell/post-b.html?raw
var post_b_default = "<div class=\"breadcrumbs effectFade fadeUp\">\n	            <a href=\"/\" class=\"link1\">\n	                Home	            </a>\n            	<div>/</div>\n            	<div>Why Governance Is the Real Bottleneck in Agentic Software Delivery</div>\n        	</div>\n            <div class=\"bg-shape\">\n                <img src=\"/wp-content/themes/agenio/assets/images/banner/shape/bg-shape.svg\" alt=\"\">\n            </div>\n            <div class=\"banner-shape-area\">\n                <img src=\"/wp-content/themes/agenio/assets/images/banner/shape/shape-01.svg\" width=\"200\" alt=\"\" class=\"one wow fadeInLeft\" data-wow-delay=\".5s\">\n                <img src=\"/wp-content/themes/agenio/assets/images/banner/shape/shape-02.svg\" width=\"200\" alt=\"\" class=\"two wow fadeInLeft\" data-wow-delay=\".5s\">\n            </div>\n        </div>\n    </div>\n</section>\n<!-- wpr banner area end -->\n\n<!-- Blog With Sidebar -->\n<section class=\"wpr-blog-area mb--16\">\n    <div class=\"container\">\n        <div class=\"section-inner border-1\">\n            <div class=\"row justify-content-between\">\n                                    <div class=\"col-lg-7\">\n                                    <div class=\"blog-single-wrap\">\n                        \n                                                   <div id=\"post-1950\" class=\"blog-single-wrap post-1950 post type-post status-publish format-standard has-post-thumbnail hentry category-uncategorized tag-agentic-ai\">\n            <div class=\"image effectFade fadeZoom\">\n            <img loading=\"lazy\" width=\"777\" height=\"548\" src=\"/wp-content/uploads/2026/07/173.jpg\" class=\"attachment-full size-full wp-post-image\" alt=\"Why Governance Is the Real Bottleneck in Agentic Software Delivery\" loading=\"lazy\" decoding=\"async\" srcset=\"/wp-content/uploads/2026/07/173.jpg 1000w, /wp-content/uploads/2026/07/173-300x185.jpg 300w, /wp-content/uploads/2026/07/173-768x475.jpg 768w\" sizes=\"auto, (max-width: 1000px) 100vw, 1000px\" />        </div>\n";
//#endregion
//#region src/layouts/shell/post-c.html?raw
var post_c_default = "</div>                        \n                                                            <div class=\"entry-footer\">\n";
//#endregion
//#region src/layouts/shell/post-d.html?raw
var post_d_default = "</div>\n                                                       \n                         \n<div class=\"comment-wrap\">\n\n    \n    \n</div><!-- /.comment-wrap -->\n\n<div class=\"post-comment\" id=\"post-comment\">\n\n    <h2 class=\"h4 heading fw-semibold\">\n        Post a Comments    </h2>\n\n    <a rel=\"nofollow\" id=\"cancel-comment-reply-link\" href=\"/resources/blogs/why-governance-is-the-real-bottleneck-in-agentic-software-delivery/#post-comment\" style=\"display:none;\">\n        Cancel reply    </a>\n\n            <p class=\"text text-body-1\">\n            Your email address will not be published. Required fields are marked *        </p>\n    \n    \n    <form action=\"/wp-comments-post.php\" method=\"post\" id=\"commentform\" class=\"form-cta style-2\" novalidate>\n\n        <div class=\"form-content\">\n\n            \n                \n                <fieldset class=\"\">\n                    <label class=\"fw-semibold text-body-3 mb-12\" for=\"author\">\n                        Your Name                        <span class=\"text-primary\">*</span>                    </label>\n                    <input\n                        id=\"author\"\n                        name=\"author\"\n                        type=\"text\"\n                        value=\"\"\n                        placeholder=\"Enter your full name\"\n                        required                    >\n                </fieldset>\n\n                <fieldset class=\"\">\n                    <label class=\"fw-semibold text-body-3 mb-12\" for=\"email\">\n                        Your Email                        <span class=\"text-primary\">*</span>                    </label>\n                    <input\n                        id=\"email\"\n                        name=\"email\"\n                        type=\"email\"\n                        value=\"\"\n                        placeholder=\"Enter your email\"\n                        required                    >\n                </fieldset>\n\n            \n            <fieldset class=\"\">\n                <label class=\"fw-semibold text-body-3 mb-12\" for=\"comment\">\n                    Comments                </label>\n                <textarea id=\"comment\" name=\"comment\" class=\"rounded-0\" placeholder=\"Enter your Comment\" required></textarea>\n            </fieldset>\n\n        </div>\n\n        <div class=\"form-action\">\n            <button type=\"submit\" id=\"submit\" class=\"wpr-btn btn-primary w-100\">\n                Post Comment            </button>\n            <input type='hidden' name='comment_post_ID' value='1950' id='comment_post_ID' />\n<input type='hidden' name='comment_parent' id='comment_parent' value='0' />\n        </div>\n\n    </form>\n\n</div><!-- /.post-comment -->\n\n                    </div>\n                </div>\n\n                                <div class=\"col-lg-4\">\n    <div class=\"blog-sidebar m-lg-0\">\n         <div id=\"block-7\" class=\"sidebar-item effectFade fadeUp no-div widget_block widget_search\"><form role=\"search\" method=\"get\" action=\"/\" class=\"wp-block-search__button-outside wp-block-search__text-button wp-block-search\"    ><label class=\"wp-block-search__label\" for=\"wp-block-search__input-1\" >Search</label><div class=\"wp-block-search__inside-wrapper\" ><input class=\"wp-block-search__input\" id=\"wp-block-search__input-1\" placeholder=\"\" value=\"\" type=\"search\" name=\"s\" required /><button aria-label=\"Search\" class=\"wp-block-search__button wp-element-button\" type=\"submit\" >Search</button></div></form></div>\n		<div id=\"recent-posts-1\" class=\"sidebar-item effectFade fadeUp no-div widget_recent_entries\">\n		 <h5 class=\"sidebar-title\">Recent Posts</h5>\n		<ul>\n											<li>\n					<a href=\"/resources/blogs/fast-isnt-safe-closing-the-governance-gap-in-greenfield-development/\">Fast Isn&#8217;t Safe: Closing the Governance Gap in Greenfield Development</a>\n									</li>\n											<li>\n					<a href=\"/resources/blogs/why-every-modernization-program-fails-without-a-knowledge-graph-first/\">Why Every Modernization Program Fails Without a Knowledge Graph First</a>\n									</li>\n											<li>\n					<a href=\"/resources/blogs/why-agentic-delivery-platforms-fail-their-compliance-review-and-what-passes/\">Why Agentic Delivery Platforms Fail Their Compliance Review, and What Passes</a>\n									</li>\n											<li>\n					<a href=\"/resources/blogs/the-autonomy-spectrum-where-ai-agents-should-and-shouldnt-have-authority/\">The Autonomy Spectrum: Where AI Agents Should and Shouldn&#8217;t Have Authority\xA0\xA0</a>\n									</li>\n											<li>\n					<a href=\"/resources/blogs/why-governance-is-the-real-bottleneck-in-agentic-software-delivery/\" aria-current=\"page\">Why Governance Is the Real Bottleneck in Agentic Software Delivery</a>\n									</li>\n					</ul>\n\n		</div><div id=\"categories-1\" class=\"sidebar-item effectFade fadeUp no-div widget_categories\"> <h5 class=\"sidebar-title\">Categories</h5>\n			<ul>\n					<li class=\"cat-item cat-item-1\"><a href=\"/resources/blogs/category/uncategorized/\">Uncategorized</a> (9)\n</li>\n			</ul>\n\n			</div><div id=\"archives-1\" class=\"sidebar-item effectFade fadeUp no-div widget_archive\"> <h5 class=\"sidebar-title\">Archives</h5>\n			<ul>\n					<li><a href='/resources/blogs/2026/07/'>July 2026</a></li>\n	<li><a href='/resources/blogs/2020/01/'>January 2020</a></li>\n			</ul>\n\n			</div><div id=\"tag_cloud-1\" class=\"sidebar-item effectFade fadeUp no-div widget_tag_cloud\"> <h5 class=\"sidebar-title\">Tags</h5><div class=\"tagcloud\"><a href=\"/resources/blogs/tag/agentic-ai/\" class=\"tag-cloud-link tag-link-20 tag-link-position-1\" style=\"font-size: 13px;\">Agentic AI</a>\n<a href=\"/resources/blogs/tag/ai-agent/\" class=\"tag-cloud-link tag-link-21 tag-link-position-2\" style=\"font-size: 13px;\">AI Agent</a>\n<a href=\"/resources/blogs/tag/greenfield/\" class=\"tag-cloud-link tag-link-30 tag-link-position-3\" style=\"font-size: 13px;\">Greenfield</a>\n<a href=\"/resources/blogs/tag/modernization/\" class=\"tag-cloud-link tag-link-28 tag-link-position-4\" style=\"font-size: 13px;\">Modernization</a></div>\n</div>        </div>\n</div>\n            \n            </div>\n        </div>\n    </div>\n</section>\n<!-- /Blog With Sidebar -->\n\n<div class='footer-width-fixer'><style>.elementor-290 .elementor-element.elementor-element-5e51681{--display:flex;--margin-top:0px;--margin-bottom:100px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-290 .elementor-element.elementor-element-c57a553{--display:flex;--justify-content:space-between;--margin-top:-209px;--margin-bottom:1px;--margin-left:1px;--margin-right:1px;}.elementor-290 .elementor-element.elementor-element-c57a553.e-con{--align-self:center;}.elementor-290 .elementor-element.elementor-element-89d5198{margin:-60px 0px calc(var(--kit-widget-spacing, 0px) + 0px) 0px;}@media(min-width:768px){.elementor-290 .elementor-element.elementor-element-c57a553{--content-width:659px;}}</style>		<div data-elementor-type=\"wp-post\" data-elementor-id=\"290\" class=\"elementor elementor-290\">\n				<div class=\"elementor-element elementor-element-5e51681 e-con-full e-flex e-con e-parent\" data-id=\"5e51681\" data-element_type=\"container\" data-e-type=\"container\">\n				<div class=\"elementor-element elementor-element-5d9f5a8 elementor-widget elementor-widget-agenio_cta_widget\" data-id=\"5d9f5a8\" data-element_type=\"widget\" data-e-type=\"widget\" id=\"footer-button\" data-widget_type=\"agenio_cta_widget.default\">\n				<div class=\"elementor-widget-container\">\n					        <!-- wpr cta area start -->\n        <section class=\"wpr-cta-area\">\n            <div class=\"container\">\n                <div class=\"section-inner border-1\">\n\n                    <div class=\"section-title-area\">\n                                                    <h2 class=\"section-title\">LET&#039;S BUILD<br />\nYOUR AI SYSTEM</h2>\n                        \n                        \n                        <!-- Right arrow track -->\n                                                <div class=\"arrow-track right\">\n                                                            <div class=\"arrow\">\n                                    <img src=\"/wp-content/themes/agenio/assets/images/cta/arrow-left.svg\" alt=\"\">\n                                </div>\n                                                            <div class=\"arrow\">\n                                    <img src=\"/wp-content/themes/agenio/assets/images/cta/arrow-left.svg\" alt=\"\">\n                                </div>\n                                                            <div class=\"arrow\">\n                                    <img src=\"/wp-content/themes/agenio/assets/images/cta/arrow-left.svg\" alt=\"\">\n                                </div>\n                                                    </div>\n                        \n                        <!-- Left arrow track -->\n                                                <div class=\"arrow-track left\">\n                                                            <div class=\"arrow\">\n                                    <img src=\"/wp-content/themes/agenio/assets/images/cta/arrow-right.svg\" alt=\"\">\n                                </div>\n                                                            <div class=\"arrow\">\n                                    <img src=\"/wp-content/themes/agenio/assets/images/cta/arrow-right.svg\" alt=\"\">\n                                </div>\n                                                            <div class=\"arrow\">\n                                    <img src=\"/wp-content/themes/agenio/assets/images/cta/arrow-right.svg\" alt=\"\">\n                                </div>\n                                                    </div>\n                                            </div>\n\n                                            <div class=\"bg-shape\">\n                            <img src=\"/wp-content/themes/agenio/assets/images/cta/grid.svg\" alt=\"\">\n                        </div>\n                    \n                    <div class=\"section-bottom-shape\">\n                                                                            <span class=\"tag left\">INTELLIGENT AUTOMATION</span>\n                                                                            <span class=\"tag right\">GLOBAL SUPPORT</span>\n                                            </div>\n\n                </div>\n            </div>\n        </section>\n        <!-- wpr cta area end -->\n        				</div>\n				</div>\n				</div>\n		<div class=\"elementor-element elementor-element-c57a553 e-flex e-con-boxed e-con e-parent\" data-id=\"c57a553\" data-element_type=\"container\" data-e-type=\"container\">\n					<div class=\"e-con-inner\">\n				<div class=\"elementor-element elementor-element-89d5198 elementor-widget elementor-widget-html\" data-id=\"89d5198\" data-element_type=\"widget\" data-e-type=\"widget\" data-widget_type=\"html.default\">\n					<div class=\"button-area\">\n                            <a href=\"/contact/\" class=\"wpr-btn btn-white\">\n                                Request a Demo                            </a>\n                            <a href=\"/solutions/\" class=\"wpr-btn btn-primary with-icon\">\n                                <div class=\"inner\">\n                                    <div class=\"icon\">\n                                                                                    <span>\n                                                <img decoding=\"async\" src=\"/wp-content/themes/agenio/assets/images/icon/button-arrow.svg\" alt=\"\">\n                                            </span>\n                                                                                    <span>\n                                                <img decoding=\"async\" src=\"/wp-content/themes/agenio/assets/images/icon/button-arrow.svg\" alt=\"\">\n                                            </span>\n                                                                                    <span>\n                                                <img decoding=\"async\" src=\"/wp-content/themes/agenio/assets/images/icon/button-arrow.svg\" alt=\"\">\n                                            </span>\n                                                                                    <span>\n                                                <img decoding=\"async\" src=\"/wp-content/themes/agenio/assets/images/icon/button-arrow.svg\" alt=\"\">\n                                            </span>\n                                                                                    <span>\n                                                <img decoding=\"async\" src=\"/wp-content/themes/agenio/assets/images/icon/button-arrow.svg\" alt=\"\">\n                                            </span>\n                                                                                    <span>\n                                                <img decoding=\"async\" src=\"/wp-content/themes/agenio/assets/images/icon/button-arrow.svg\" alt=\"\">\n                                            </span>\n                                                                            </div>\n                                </div>\n                                Learn more                            </a>\n                        </div>				</div>\n					</div>\n				</div>\n				</div>\n		</div>		<footer itemtype=\"https://schema.org/WPFooter\" itemscope=\"itemscope\" id=\"colophon\" role=\"contentinfo\">\n			<div class='footer-width-fixer'><style>.elementor-46 .elementor-element.elementor-element-fa6b53b{--display:flex;--margin-top:10px;--margin-bottom:0px;--margin-left:0px;--margin-right:1px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-46 .elementor-element.elementor-element-40b8701{--display:flex;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-46 .elementor-element.elementor-element-ae93211 > .elementor-widget-container{margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}.elementor-46 .elementor-element.elementor-element-58faa94{width:100%;max-width:100%;}.elementor-46 .elementor-element.elementor-element-58faa94.elementor-element{--flex-grow:0;--flex-shrink:0;}</style>		<div data-elementor-type=\"wp-post\" data-elementor-id=\"46\" class=\"elementor elementor-46\">\n				<div class=\"elementor-element elementor-element-fa6b53b e-con-full e-flex e-con e-parent\" data-id=\"fa6b53b\" data-element_type=\"container\" data-e-type=\"container\">\n				<div class=\"elementor-element elementor-element-b51ed83 elementor-widget elementor-widget-agenio_contact_widget\" data-id=\"b51ed83\" data-element_type=\"widget\" data-e-type=\"widget\" data-widget_type=\"agenio_contact_widget.default\">\n				<div class=\"elementor-widget-container\">\n					        <!-- wpr contact area start -->\n        <section id=\"contact\" class=\"wpr-contact-area mb--16\">\n            <div class=\"container\">\n                <div class=\"section-inner\">\n\n                    <!-- Left Content -->\n                    <div class=\"left-content-area\">\n\n                        <!-- Get In Touch -->\n                        <div class=\"get-in-touch\">\n                            <p class=\"sub-title\">CONTACT</p>\n                            <ul>\n                                                                <li>\n                                    <a href=\"mailto:connect@synthetixlabs.ai\">\n                                        connect@synthetixlabs.ai                                    </a>\n                                </li>\n                                                                <li>\n                                    <a href=\"tel:+91678-514-3500\">\n                                        678-514-3500                                    </a>\n                                </li>\n                                                            </ul>\n                        </div>\n\n                        <!-- Offices -->\n                        <div class=\"location-area\">\n                            <p class=\"sub-title\">OFFICES</p>\n                            <ul>\n                                                                <li>\n                                    <h2 class=\"h4\">Atlanta</h2>\n                                    <p>3060 Kimball Bridge Road<br />\nSuite 200<br />\nAlpharetta, GA 30022;</p>\n                                </li>\n                                                                <li>\n                                    <h2 class=\"h4\">California</h2>\n                                    <p>925 Highland Pointe Drive<br />\nSuite 340<br />\nRoseville, CA 95678</p>\n                                </li>\n                                                                <li>\n                                    <h2 class=\"h4\">Bengaluru</h2>\n                                    <p>6th Floor, 144, MSR North Tower,<br />\nOuter Ring Rd, MS Ramaiah North<br />\nCity, Manayata Tech Park, Nagavara,<br />\nBengaluru, Karnataka - 560045 </p>\n                                </li>\n                                                            </ul>\n                        </div>\n\n                    </div>\n\n                    <!-- Contact Form -->\n                    <div class=\"contact-form-area\">\n                        \n\n                    </div>\n\n                </div>\n            </div>\n        </section>\n        <!-- wpr contact area end -->\n        				</div>\n				</div>\n				</div>\n		<div class=\"elementor-element elementor-element-40b8701 e-con-full e-flex e-con e-parent\" data-id=\"40b8701\" data-element_type=\"container\" data-e-type=\"container\">\n				<div class=\"elementor-element elementor-element-ae93211 elementor-widget elementor-widget-agenio_footer_widget\" data-id=\"ae93211\" data-element_type=\"widget\" data-e-type=\"widget\" id=\"last-footer\" data-widget_type=\"agenio_footer_widget.default\">\n				<div class=\"elementor-widget-container\">\n					        <!-- wpr footer area start -->\n        <div class=\"wpr-footer-area\">\n            <div class=\"container\">\n                <div class=\"section-inner border-1\">\n\n                    <!-- Footer Top Nav -->\n                    <div class=\"footer-top\">\n                        <ul>\n                                                                                            <li>\n                                    <a href=\"/company/\">\n                                        About Us                                    </a>\n                                </li>\n                                                                                                <li class=\"square-dot\"></li>\n                                                                <li>\n                                    <a href=\"/solutions/\">\n                                        Services                                    </a>\n                                </li>\n                                                                                                <li class=\"square-dot\"></li>\n                                                                <li>\n                                    <a href=\"/resources/case-study/\">\n                                        Projects                                    </a>\n                                </li>\n                                                                                                <li class=\"square-dot\"></li>\n                                                                <li>\n                                    <a href=\"/#pricing\">\n                                        Pricing Plan                                    </a>\n                                </li>\n                                                    </ul>\n                    </div>\n\n                    <!-- Footer Logo -->\n                    <div class=\"footer-logo-area square-dot\">\n                        <a href=\"/\">\n                            <img src=\"/wp-content/themes/agenio/assets/images/logo/footer-logo.svg\" alt=\"Synthetix Labs\">\n                        </a>\n                        <div class=\"shape one\">\n                            <img src=\"/wp-content/themes/agenio/assets/images/logo/shape-01.svg\" alt=\"\">\n                        </div>\n                        <div class=\"shape two\">\n                            <img src=\"/wp-content/themes/agenio/assets/images/logo/shape-02.svg\" alt=\"\">\n                        </div>\n                        <span class=\"square-shape top-left\"></span>\n                        <span class=\"square-shape top-right\"></span>\n                        <span class=\"square-shape bottom-left\"></span>\n                        <span class=\"square-shape bottom-right\"></span>\n                    </div>\n\n                    <!-- Copyright Area -->\n                    <div class=\"copyright-area\">\n\n                        <!-- Social Links -->\n                        <div class=\"left-social-area\">\n                            <ul>\n                                                                <li>\n                                    <a href=\"/resources/blogs/why-governance-is-the-real-bottleneck-in-agentic-software-delivery/#\">\n                                        Instagram                                    </a>\n                                </li>\n                                                                <li>\n                                    <a href=\"/resources/blogs/why-governance-is-the-real-bottleneck-in-agentic-software-delivery/#\">\n                                        Linkedin                                    </a>\n                                </li>\n                                                                <li>\n                                    <a href=\"/resources/blogs/why-governance-is-the-real-bottleneck-in-agentic-software-delivery/#\">\n                                        Dribbble                                    </a>\n                                </li>\n                                                                <li>\n                                    <a href=\"/resources/blogs/why-governance-is-the-real-bottleneck-in-agentic-software-delivery/#\">\n                                        Behance                                    </a>\n                                </li>\n                                                            </ul>\n                        </div>\n\n                        <!-- Copyright -->\n                        <p class=\"copyright\">\n                            &copy; 2026 Agenio. All Rights Reserved                        </p>\n\n                        <!-- Scroll To Top -->\n                        <button class=\"scroll-top-btn\">\n                            Back to Top                            <svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                                <path d=\"M8 3.29688L7.64062 3.64062L1.39062 9.89062L2.10938 10.6094L8 4.71875L13.8906 10.6094L14.6094 9.89062L8.35938 3.64062L8 3.29688Z\" fill=\"black\" />\n                            </svg>\n                        </button>\n\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <!-- wpr footer area end -->\n        				</div>\n				</div>\n				</div>\n		<div class=\"elementor-element elementor-element-edeb45b e-con e-atomic-element e-flexbox-base e-1c0d0dd \" data-id=\"edeb45b\" data-element_type=\"e-flexbox\" data-e-type=\"e-flexbox\" data-interaction-id=\"edeb45b\">\n    <div class=\"elementor-element elementor-element-33838b2 e-con e-atomic-element e-flexbox-base \" data-id=\"33838b2\" data-element_type=\"e-flexbox\" data-e-type=\"e-flexbox\" data-interaction-id=\"33838b2\">\n    		<div class=\"elementor-element elementor-element-58faa94 elementor-widget__width-inherit elementor-widget elementor-widget-html\" data-id=\"58faa94\" data-element_type=\"widget\" data-e-type=\"widget\" data-widget_type=\"html.default\">\n					<div class=\"cf-bottom\">\n    <p class=\"cf-copyright\">\n        © 2026 synthetixlabs, Inc. All rights reserved.</p>\n\n    <nav class=\"cf-legal\" aria-label=\"Legal\">\n        <a href=\"/wp-content/uploads/2026/07/gdpr-v1-6-072024.pdf\" target=\"_blank\" rel=\"noopener\">GDPR</a>\n        <a href=\"/wp-content/uploads/2026/07/ccpa-cra-v1-3-072024.pdf\" target=\"_blank\" rel=\"noopener\">CCPA/CPRA</a>\n        <a href=\"/wp-content/uploads/2026/07/web-privacy-policy.pdf\" target=\"_blank\" rel=\"noopener\">Privacy</a>\n        <a href=\"https://www.microsoft.com/en-us/privacy/privacystatement\" target=\"_blank\" rel=\"noopener\">Microsoft Privacy Statement</a>\n        <a href=\"/wp-content/uploads/2026/07/privacy-policy-introduction-v2-072024.pdf\" target=\"_blank\" rel=\"noopener\">Privacy Introduction</a>\n          <a href=\"/wp-content/uploads/2026/07/pci-072025-reasonable-accomodation-policy.pdf\" target=\"_blank\" rel=\"noopener\">Reasonable Accommodation Policy</a>\n        <a href=\"/resources/blogs/why-governance-is-the-real-bottleneck-in-agentic-software-delivery/#\" data-action=\"cookie-prefs\">Cookie Preferences</a>\n    </nav>\n</div>				</div>\n		\n</div>\n\n</div>\n		</div>\n		</div>		</footer>\n	</div><!-- #page -->\n<script type=\"speculationrules\">\n{\"prefetch\":[{\"source\":\"document\",\"where\":{\"and\":[{\"href_matches\":\"/*\"},{\"not\":{\"href_matches\":[\"/wp-*.php\",\"/wp-admin/*\",\"/wp-content/uploads/*\",\"/wp-content/*\",\"/wp-content/plugins/*\",\"/wp-content/themes/agenio/*\",\"/*\\\\?(.+)\"]}},{\"not\":{\"selector_matches\":\"a[rel~=\\\"nofollow\\\"]\"}},{\"not\":{\"selector_matches\":\".no-prefetch, .no-prefetch a\"}}]},\"eagerness\":\"conservative\"}]}\n<\/script>\n			<script>\n				const registerAllyAction = () => {\n					if ( ! window?.ElementorProFrontendConfig || ! window?.elementorFrontend?.utils?.urlActions ) {\n						return;\n					}\n\n					elementorFrontend.utils.urlActions.addAction( 'allyWidget:open', () => {\n						if (window?.ea11yWidget?.widget?.open) {\n							return window.ea11yWidget.widget.isOpen()\n								? window.ea11yWidget.widget.close()\n								: window.ea11yWidget.widget.open();\n						}\n					} );\n				};\n\n				const waitingLimit = 30;\n				let retryCounter = 0;\n\n				const waitForElementorPro = () => {\n					return new Promise( ( resolve ) => {\n						const intervalId = setInterval( () => {\n							if ( retryCounter === waitingLimit ) {\n								resolve( null );\n							}\n\n							retryCounter++;\n\n							if ( window.elementorFrontend && window?.elementorFrontend?.utils?.urlActions ) {\n								clearInterval( intervalId );\n								resolve( window.elementorFrontend );\n							}\n								}, 100 ); // Check every 100 milliseconds for availability of elementorFrontend\n					});\n				};\n\n				waitForElementorPro().then( () => { registerAllyAction(); });\n			<\/script>\n						<script>\n				const lazyloadRunObserver = () => {\n					const lazyloadBackgrounds = document.querySelectorAll( `.e-con.e-parent:not(.e-lazyloaded)` );\n					const lazyloadBackgroundObserver = new IntersectionObserver( ( entries ) => {\n						entries.forEach( ( entry ) => {\n							if ( entry.isIntersecting ) {\n								let lazyloadBackground = entry.target;\n								if( lazyloadBackground ) {\n									lazyloadBackground.classList.add( 'e-lazyloaded' );\n								}\n								lazyloadBackgroundObserver.unobserve( entry.target );\n							}\n						});\n					}, { rootMargin: '200px 0px 200px 0px' } );\n					lazyloadBackgrounds.forEach( ( lazyloadBackground ) => {\n						lazyloadBackgroundObserver.observe( lazyloadBackground );\n					} );\n				};\n				const events = [\n					'DOMContentLoaded',\n					'elementor/lazyload/observe',\n				];\n				events.forEach( ( event ) => {\n					document.addEventListener( event, lazyloadRunObserver );\n				} );\n			<\/script>\n			<script id=\"wp-hooks-js\" src=\"/wp-includes/js/dist/hooks.min.js\"><\/script>\n<script id=\"wp-i18n-js\" src=\"/wp-includes/js/dist/i18n.min.js\"><\/script>\n<script id=\"wp-i18n-js-after\">\nwp.i18n.setLocaleData( { 'text direction\\u0004ltr': [ 'ltr' ] } );\n//# sourceURL=wp-i18n-js-after\n<\/script>\n<script id=\"leadin-script-loader-js-js-extra\">\nvar leadin_wordpress = {\"userRole\":\"visitor\",\"pageType\":\"post\",\"leadinPluginVersion\":\"11.3.51\"};\n//# sourceURL=leadin-script-loader-js-js-extra\n<\/script>\n<script id=\"leadin-script-loader-js-js\" src=\"https://js.hs-scripts.com/40221584.js?integration=WordPress&#038;ver=11.3.51\"><\/script>\n<script id=\"angie-canvas-template-js-before\">\nangieCanvasTemplateData = {\"templateSlug\":\"angie-canvas\"};\n//# sourceURL=angie-canvas-template-js-before\n<\/script>\n<script id=\"bootstrap-js\" src=\"/wp-content/themes/agenio/assets/js/plugins/bootstrap.min.js\"><\/script>\n<script id=\"metismenu-js\" src=\"/wp-content/themes/agenio/assets/js/plugins/metismenu.js\"><\/script>\n<script id=\"jqueryui-js\" src=\"/wp-content/themes/agenio/assets/js/vendor/jqueryui.js\"><\/script>\n<script id=\"waypoint-js\" src=\"/wp-content/themes/agenio/assets/js/vendor/waypoint.js\"><\/script>\n<script id=\"swiper-js\" src=\"/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js\"><\/script>\n<script id=\"gsap-js\" src=\"/wp-content/themes/agenio/assets/js/plugins/gsap.min.js\"><\/script>\n<script id=\"scrolltrigger-js\" src=\"/wp-content/themes/agenio/assets/js/plugins/scrolltrigger.js\"><\/script>\n<script id=\"smoothscroll-js\" src=\"/wp-content/themes/agenio/assets/js/plugins/smoothscroll.js\"><\/script>\n<script id=\"split-text-js\" src=\"/wp-content/themes/agenio/assets/js/vendor/split-text.js\"><\/script>\n<script id=\"split-type-js\" src=\"/wp-content/themes/agenio/assets/js/vendor/split-type.js\"><\/script>\n<script id=\"wow-js\" src=\"/wp-content/themes/agenio/assets/js/vendor/wow.js\"><\/script>\n<script id=\"text-plugin-js\" src=\"/wp-content/themes/agenio/assets/js/vendor/text-plugin.js\"><\/script>\n<script id=\"odometer-js\" src=\"/wp-content/themes/agenio/assets/js/plugins/odometer.js\"><\/script>\n<script id=\"agenio-contact-form-js\" src=\"/wp-content/themes/agenio/assets/js/plugins/contact-form.js\"><\/script>\n<script id=\"agenio-main-js\" src=\"/wp-content/themes/agenio/assets/js/main.js\"><\/script>\n<script id=\"eael-general-js-extra\">\nvar localize = {\"ajaxurl\":\"/wp-admin/admin-ajax.php\",\"nonce\":\"d0f0bbe39e\",\"i18n\":{\"added\":\"Added \",\"compare\":\"Compare\",\"loading\":\"Loading...\"},\"eael_translate_text\":{\"required_text\":\"is a required field\",\"invalid_text\":\"Invalid\",\"billing_text\":\"Billing\",\"shipping_text\":\"Shipping\",\"fg_mfp_counter_text\":\"of\"},\"page_permalink\":\"/resources/blogs/why-governance-is-the-real-bottleneck-in-agentic-software-delivery/\",\"cart_redirectition\":\"\",\"cart_page_url\":\"\",\"el_breakpoints\":{\"mobile\":{\"label\":\"Mobile Portrait\",\"value\":767,\"default_value\":767,\"direction\":\"max\",\"is_enabled\":true},\"mobile_extra\":{\"label\":\"Mobile Landscape\",\"value\":880,\"default_value\":880,\"direction\":\"max\",\"is_enabled\":false},\"tablet\":{\"label\":\"Tablet Portrait\",\"value\":1024,\"default_value\":1024,\"direction\":\"max\",\"is_enabled\":true},\"tablet_extra\":{\"label\":\"Tablet Landscape\",\"value\":1200,\"default_value\":1200,\"direction\":\"max\",\"is_enabled\":false},\"laptop\":{\"label\":\"Laptop\",\"value\":1366,\"default_value\":1366,\"direction\":\"max\",\"is_enabled\":false},\"widescreen\":{\"label\":\"Widescreen\",\"value\":2400,\"default_value\":2400,\"direction\":\"min\",\"is_enabled\":false}}};\n//# sourceURL=eael-general-js-extra\n<\/script>\n<script id=\"eael-general-js\" src=\"/wp-content/plugins/essential-addons-for-elementor-lite/assets/front-end/js/view/general.min.js\"><\/script>\n<script id=\"elementor-webpack-runtime-js\" src=\"/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js\"><\/script>\n<script id=\"elementor-frontend-modules-js\" src=\"/wp-content/plugins/elementor/assets/js/frontend-modules.min.js\"><\/script>\n<script id=\"jquery-ui-core-js\" src=\"/wp-includes/js/jquery/ui/core.min.js\"><\/script>\n<script id=\"elementor-frontend-js-extra\">\nvar EAELImageMaskingConfig = {\"svg_dir_url\":\"/wp-content/plugins/essential-addons-for-elementor-lite/assets/front-end/img/image-masking/svg-shapes/\"};\n//# sourceURL=elementor-frontend-js-extra\n<\/script>\n<script id=\"elementor-frontend-js-before\">\nvar elementorFrontendConfig = {\"environmentMode\":{\"edit\":false,\"wpPreview\":false,\"isScriptDebug\":false},\"i18n\":{\"shareOnFacebook\":\"Share on Facebook\",\"shareOnTwitter\":\"Share on Twitter\",\"pinIt\":\"Pin it\",\"download\":\"Download\",\"downloadImage\":\"Download image\",\"fullscreen\":\"Fullscreen\",\"zoom\":\"Zoom\",\"share\":\"Share\",\"playVideo\":\"Play Video\",\"previous\":\"Previous\",\"next\":\"Next\",\"close\":\"Close\",\"a11yCarouselPrevSlideMessage\":\"Previous slide\",\"a11yCarouselNextSlideMessage\":\"Next slide\",\"a11yCarouselFirstSlideMessage\":\"This is the first slide\",\"a11yCarouselLastSlideMessage\":\"This is the last slide\",\"a11yCarouselPaginationBulletMessage\":\"Go to slide\"},\"is_rtl\":false,\"breakpoints\":{\"xs\":0,\"sm\":480,\"md\":768,\"lg\":1025,\"xl\":1440,\"xxl\":1600},\"responsive\":{\"breakpoints\":{\"mobile\":{\"label\":\"Mobile Portrait\",\"value\":767,\"default_value\":767,\"direction\":\"max\",\"is_enabled\":true},\"mobile_extra\":{\"label\":\"Mobile Landscape\",\"value\":880,\"default_value\":880,\"direction\":\"max\",\"is_enabled\":false},\"tablet\":{\"label\":\"Tablet Portrait\",\"value\":1024,\"default_value\":1024,\"direction\":\"max\",\"is_enabled\":true},\"tablet_extra\":{\"label\":\"Tablet Landscape\",\"value\":1200,\"default_value\":1200,\"direction\":\"max\",\"is_enabled\":false},\"laptop\":{\"label\":\"Laptop\",\"value\":1366,\"default_value\":1366,\"direction\":\"max\",\"is_enabled\":false},\"widescreen\":{\"label\":\"Widescreen\",\"value\":2400,\"default_value\":2400,\"direction\":\"min\",\"is_enabled\":false}},\"hasCustomBreakpoints\":false},\"version\":\"4.1.3\",\"is_static\":false,\"experimentalFeatures\":{\"e_font_icon_svg\":true,\"additional_custom_breakpoints\":true,\"container\":true,\"e_optimized_markup\":true,\"e_pro_free_trial_popup\":true,\"nested-elements\":true,\"e_atomic_elements\":true,\"atomic_widgets_should_enforce_capabilities\":true,\"editor_mcp\":true,\"e_bc_migrations\":true,\"e_editor_design_system_panel\":true,\"e_classes\":true,\"global_classes_should_enforce_capabilities\":true,\"e_variables\":true,\"e_variables_manager\":true,\"e_opt_in_v4_page\":true,\"e_opt_in_v4\":true,\"e_components\":true,\"e_interactions\":true,\"e_widget_creation\":true,\"import-export-customization\":true},\"urls\":{\"assets\":\"\\/wp-content\\/plugins\\/elementor\\/assets\\/\",\"ajaxurl\":\"\\/wp-admin\\/admin-ajax.php\",\"uploadUrl\":\"\\/wp-content\\/uploads\"},\"nonces\":{\"floatingButtonsClickTracking\":\"065cadef30\",\"atomicFormsSendForm\":\"7c9c75e97f\"},\"swiperClass\":\"swiper\",\"settings\":{\"page\":[],\"editorPreferences\":[]},\"kit\":{\"active_breakpoints\":[\"viewport_mobile\",\"viewport_tablet\"],\"global_image_lightbox\":\"yes\",\"lightbox_enable_counter\":\"yes\",\"lightbox_enable_fullscreen\":\"yes\",\"lightbox_enable_zoom\":\"yes\",\"lightbox_enable_share\":\"yes\",\"lightbox_title_src\":\"title\",\"lightbox_description_src\":\"description\"},\"post\":{\"id\":1950,\"title\":\"Why%20Governance%20Is%20the%20Real%20Bottleneck%20in%20Agentic%20Software%20Delivery%20%E2%80%93%20Synthetix%20Labs\",\"excerpt\":\"\",\"featuredImage\":\"\\/wp-content\\/uploads\\/2026\\/07\\/173.jpg\"}};\n//# sourceURL=elementor-frontend-js-before\n<\/script>\n<script id=\"elementor-frontend-js\" src=\"/wp-content/plugins/elementor/assets/js/frontend.min.js\"><\/script>\n<script async data-wp-strategy=\"async\" fetchpriority=\"low\" id=\"comment-reply-js\" src=\"/wp-includes/js/comment-reply.min.js\"><\/script>\n";
//#endregion
//#region src/layouts/Post.astro
createAstro("https://astro.build");
var $$Post = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Post;
	const { title, canonical, bodyClass, author = "Nitin Sinha", authorSlug = "nitin", date, tags = [] } = Astro.props;
	const dateLabel = date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC"
	});
	const dateHref = `/resources/blogs/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/`;
	const tagLabel = (t) => t.split("-").map((w) => w === "ai" ? "AI" : w[0].toUpperCase() + w.slice(1)).join(" ");
	const bWithCrumb = post_b_default.replace(/(<div class="breadcrumbs[\s\S]*?<div>\/<\/div>\s*<div>)[\s\S]*?(<\/div>)/, `$1${title}$2`);
	return renderTemplate`<html lang="en-US"><head><meta charset="UTF-8"><title>${unescapeHTML(title)}</title><link rel="canonical"${addAttribute(canonical, "href")}>${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${unescapeHTML(post_head_default)}` })}${renderHead($$result)}</head><body${addAttribute(bodyClass, "class")}>${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${unescapeHTML(post_a_default)}` })}<h1 class="title effectFade fadeUp">${unescapeHTML(title)}</h1>${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${unescapeHTML(bWithCrumb)}` })}<div class="meta-list"><div class="meta-item"><i class="icon icon-user-solid"></i><a${addAttribute(`/resources/blogs/author/${authorSlug}/`, "href")} class="link">${author}</a></div><div class="meta-item"><i class="icon icon-clock-solid"></i><a${addAttribute(dateHref, "href")} class="link">${dateLabel}</a></div></div><div class="text-body-2 mb--0">${renderSlot($$result, $$slots["default"])}</div>${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${unescapeHTML(post_c_default)}` })}${tags.length > 0 && renderTemplate`<div class="tags-links"><h2 class="h6 text-body-1">Tags:</h2><div class="list-tags">${tags.map((t) => renderTemplate`<a${addAttribute(`/resources/blogs/tag/${t}/`, "href")} class="tags-item fw-semibold">${tagLabel(t)}</a>`)}</div></div>`}${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${unescapeHTML(post_d_default)}` })}</body></html>`;
}, "/Users/vishak/Projects/Synthetix Labs Website/synthetixlabs-site/src/layouts/Post.astro", void 0);
//#endregion
export { getCollection as n, renderEntry as r, $$Post as t };
