const REMOVE = {
	space: 			[{reg: /( |　)/g, replacement: ""},],
	tab: 				[{reg: /\t/g, replacement: ""},],
	whiteReturn: [{reg: /^(\s*[\r\n])+/gm, replacement: ""},],
	htmlTag:		[{reg: /<.+?>|<\/.+?>/g, replacement: ""},],
	all: []
}

REMOVE.all = [].concat(
	REMOVE.space, REMOVE.tab,
	REMOVE.whiteReturn, REMOVE.htmlTag,
)

const TOZH = {
	space: [
		{reg: / /g, replacement: "　"},
	],
	comma: [
		{reg: /,/g, replacement: "，"},
		{reg: /\./g, replacement: "。"},
	],
	questionmark: [
		{reg: /\?/g, replacement: "？"},
		{reg: /!/g, replacement: "！"},
	],
	colon: [
		{reg: /;/g, replacement: "；"},
		{reg: /:/g, replacement: "："},
	],
	bracket: [
		{reg: /\(/g, replacement: "（"},
		{reg: /\)/g, replacement: "）"},
	],
	squareBracket: [
		{reg: /\[/g, replacement: "【"},
		{reg: /\]/g, replacement: "】"},
	],
	quot: [
		{reg: /"(.*?)"/g, replacement: "“$1”"},
		{reg: /'(.*?)'/g, replacement: "‘$1’"},
	],
	connector: [
		{reg: /-/g, replacement: "—"},
		{reg: /\.\.\./g, replacement: "…"},
	],
	book: [
		{reg: /\</g, replacement: "《"},
		{reg: /\>/g, replacement: "》"},
	],
	backslash: [
		{reg: /\\/g, replacement: "、"},
	],
	all: []
}

TOZH.all = [].concat(
	TOZH.space, TOZH.comma,
	TOZH.questionmark, TOZH.colon,
	TOZH.bracket, TOZH.quot,
	TOZH.connector,  TOZH.book, TOZH.squareBracket,
	TOZH.backslash
)

const TOEN = {
	space: [
		{reg: /　/g, replacement: " "},
	],
	comma: [
		{reg: /，/g, replacement: ","},
		{reg: /。/g, replacement: "."},
	],
	colon: [
		{reg: /；/g, replacement: ";"},
		{reg: /：/g, replacement: ":"},
	],
	quot: [
		{reg: /[“”]/g, replacement: "\""},
		{reg: /[‘’]/g, replacement: "\'"},
	],
	questionmark: [
		{reg: /？/g, replacement: "?"},
		{reg: /！/g, replacement: "!"},
	],
	bracket: [
		{reg: /（/g, replacement: "("},
		{reg: /）/g, replacement: ")"},
	],
	squareBracket: [
		{reg: /【/g, replacement: "["},
		{reg: /】/g, replacement: "]"},
	],
	connector: [
		{reg: /[－—–]/g, replacement: "-"},
		{reg: /…/g, replacement: "..."},
	],
	book: [
		{reg: /《/g, replacement: "<"},
		{reg: /》/g, replacement: ">"},
	],
	backslash: [
		{reg: /、/g, replacement: "\\"},
	],
	all: []
}
TOEN.all = [].concat(
	TOEN.space, TOEN.comma,
	TOEN.questionmark, TOEN.colon,
	TOEN.bracket, TOEN.quot,
	TOEN.connector, TOEN.book, TOEN.squareBracket,
	TOEN.backslash
)

const MATCH = {
	symbolEn: /[,.:;'"!\?\[\]#@%\^\$\(\)\*\-\=\+\_\<\>\/\\{}`~]/g,
	symbolCn: /[，。：；”…“《》、？【】『』、（）￥！・—]/g,
	characterEn: /[a-zA-Z]/g,
	characterCn: /[\u4e00-\u9fa5]/g,
	space: /[ 　]/g,
	tab: /\t/g,
	quot: /['"”“]/g,
	comma: /[，。,\.]/g,
}

let textarea;
window.onload = function () {
	textarea = $('#text');
}

function regReplace (regs) {
	regs.forEach(item => {
		textarea.value = textarea.value.replace(item.reg, item.replacement)
	})
	updateInfos()
}


function $(selector) {
	return document.querySelector(selector);
}

function updateInfos() {
	let countSymbolChinese = textarea.value.match(MATCH.symbolCn)
	let countSymbolEnglish = textarea.value.match(MATCH.symbolEn)
	let countCharacterEnglish = textarea.value.match(MATCH.characterEn)
	let countCharacterChinese = textarea.value.match(MATCH.characterCn)

	$('#tol').innerText = textarea.value.length
	$('#symbolChinese').innerText = countSymbolChinese ? countSymbolChinese.length : 0
	$('#symbolEnglish').innerText = countSymbolEnglish ? countSymbolEnglish.length : 0
	$('#englishCharacter').innerText = countCharacterEnglish ? countCharacterEnglish.length : 0
	$('#chineseCharacter').innerText = countCharacterChinese ? countCharacterChinese.length : 0
}