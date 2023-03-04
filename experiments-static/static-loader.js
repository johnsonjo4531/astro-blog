import { html, render } from "./static-lib/lit-html.js";
function replaceAll(string, items, replacements) {
	return items.reduce(
		(string, item, i) => string.replace(item, replacements[i]),
		string
	);
}
const _log = console.log.bind(console);
function Log(item) {
	_log(...item.params);
	return html`
		<style>
			.logItem {
				--border: 1px solid black;
				border-top: var(--border);
				border-bottom: var(--border);
				padding: 0.25em;
			}
			.console-time {
				color: #888;
				float: right;
			}
		</style>
		<div class="logItem">
			<span class="console-time">${item.timestamp}</span
			><span
				>${replaceAll(
					item.params.join(" "),
					["&", "<", ">", '"', "'", "="],
					["&amp;", "&lt;", "&gt", "&quot;", "&apos;", "&eq;"]
				)}</span
			>
		</div>
	`;
}
const types = new Map([["log", Log]]);
function Console(logItems) {
	return html`
		<style>
			.logging-interface {
				max-height: 25vh;
				height: 200px;
				position: fixed;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: #ddd;
				color: black;
				overflow-y: auto;
				overflow-x: hidden;
			}
		</style>
		<div class="logging-interface">
			${logItems.map(item => types.get(item.type)(item))}
		</div>
	`;
}
function display(logItems) {
	render(Console(logItems), document.getElementById("logger-interface"));
}
const logItems = [];
window.consoleOut = (type = "log") => (...params) => {
	logItems.push({
		type,
		params,
		timestamp: new Date().toISOString(),
	});
	display(logItems);
};

window.console.log = consoleOut("log");
