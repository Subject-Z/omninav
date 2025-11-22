// 语言配置
const languageTexts = {
    'zh': {
        'title': '中英文标点符号转换器',
        'total-chars': '总字符数',
        'chinese-chars': '中文字符',
        'english-chars': '英文字符',
        'chinese-punc': '中文标点',
        'english-punc': '英文标点',
        'remove-title': '删除',
        'remove-all': '全部',
        'remove-spaces': '空格',
        'remove-blank-lines': '空行',
        'remove-tabs': '制表符',
        'remove-html': 'HTML标签',
        'to-chinese-title': '转换为中文',
        'to-zh-all': '全部',
        'to-zh-spaces': '空格',
        'to-zh-comma': '，。',
        'to-zh-question': '！？',
        'to-zh-colon': '；：',
        'to-zh-bracket': '（）',
        'to-zh-quot': '" "',
        'to-zh-connector': '- …',
        'to-zh-square': '[]【】',
        'to-zh-book': '<>《》',
        'to-zh-backslash': '\\ 、',
        'to-english-title': '转换为英文',
        'to-en-all': '全部',
        'to-en-spaces': '空格',
        'to-en-comma': ', .',
        'to-en-question': '! ?',
        'to-en-colon': '; :',
        'to-en-bracket': '( )',
        'to-en-quot': '" "',
        'to-en-connector': '- …',
        'to-en-square': '【】[]',
        'to-en-book': '《》<>',
        'to-en-backslash': '、 \\'
    },
    'en': {
        'title': 'Chinese-English Punctuation Converter',
        'total-chars': 'Total Characters',
        'chinese-chars': 'Chinese Characters',
        'english-chars': 'English Characters',
        'chinese-punc': 'Chinese Punctuation',
        'english-punc': 'English Punctuation',
        'remove-title': 'Remove',
        'remove-all': 'ALL',
        'remove-spaces': 'Spaces',
        'remove-blank-lines': 'Blank Lines',
        'remove-tabs': 'Tab',
        'remove-html': 'HTML Tags',
        'to-chinese-title': 'Convert to Chinese',
        'to-zh-all': 'ALL',
        'to-zh-spaces': 'Spaces',
        'to-zh-comma': '，。',
        'to-zh-question': '！？',
        'to-zh-colon': '；：',
        'to-zh-bracket': '（）',
        'to-zh-quot': '" "',
        'to-zh-connector': '- …',
        'to-zh-square': '[]【】',
        'to-zh-book': '<>《》',
        'to-zh-backslash': '\\ 、',
        'to-english-title': 'Convert to English',
        'to-en-all': 'ALL',
        'to-en-spaces': 'Spaces',
        'to-en-comma': ', .',
        'to-en-question': '! ?',
        'to-en-colon': '; :',
        'to-en-bracket': '( )',
        'to-en-quot': '" "',
        'to-en-connector': '- …',
        'to-en-square': '【】[]',
        'to-en-book': '《》<>',
        'to-en-backslash': '、 \\'
    }
};

// 正则表达式配置
const REMOVE = {
    space: [{ reg: /( |　)/g, replacement: "" }],
    tab: [{ reg: /\t/g, replacement: "" }],
    whiteReturn: [{ reg: /^(\s*[\r\n])+/gm, replacement: "" }],
    htmlTag: [{ reg: /<.+?>|<\/.+?>/g, replacement: "" }],
    all: []
}

REMOVE.all = [].concat(
    REMOVE.space, REMOVE.tab,
    REMOVE.whiteReturn, REMOVE.htmlTag,
)

const TOZH = {
    space: [
        { reg: / /g, replacement: "　" },
    ],
    comma: [
        { reg: /,/g, replacement: "，" },
        { reg: /(?<!\.)\.(?!\.)/g, replacement: "。" },
    ],
    questionmark: [
        { reg: /\?/g, replacement: "？" },
        { reg: /!/g, replacement: "！" },
    ],
    colon: [
        { reg: /;/g, replacement: "；" },
        { reg: /:/g, replacement: "：" },
    ],
    bracket: [
        { reg: /\(/g, replacement: "（" },
        { reg: /\)/g, replacement: "）" },
    ],
    squareBracket: [
        { reg: /\[/g, replacement: "【" },
        { reg: /\]/g, replacement: "】" },
    ],
    quot: [
        { reg: /"(.*?)"/g, replacement: "“$1”" },
        { reg: /'(.*?)'/g, replacement: "‘$1’" },
    ],
    connector: [
        { reg: /-/g, replacement: "—" },
        { reg: /\.\.\./g, replacement: "…" },
    ],
    book: [
        { reg: /\</g, replacement: "《" },
        { reg: /\>/g, replacement: "》" },
    ],
    backslash: [
        { reg: /\\/g, replacement: "、" },
    ],
    all: []
}

TOZH.all = [].concat(
    TOZH.space,
    TOZH.connector,
    TOZH.comma,
    TOZH.questionmark, TOZH.colon,
    TOZH.bracket, TOZH.quot,
    TOZH.book, TOZH.squareBracket,
    TOZH.backslash
)

const TOEN = {
    space: [
        { reg: /　/g, replacement: " " },
    ],
    comma: [
        { reg: /，/g, replacement: "," },
        { reg: /。/g, replacement: "." },
    ],
    colon: [
        { reg: /；/g, replacement: ";" },
        { reg: /：/g, replacement: ":" },
    ],
    quot: [
        { reg: /[“”]/g, replacement: "\"" },
        { reg: /[‘’]/g, replacement: "\'" },
    ],
    questionmark: [
        { reg: /？/g, replacement: "?" },
        { reg: /！/g, replacement: "!" },
    ],
    bracket: [
        { reg: /（/g, replacement: "(" },
        { reg: /）/g, replacement: ")" },
    ],
    squareBracket: [
        { reg: /【/g, replacement: "[" },
        { reg: /】/g, replacement: "]" },
    ],
    connector: [
        { reg: /[－—–]/g, replacement: "-" },
        { reg: /…/g, replacement: "..." },
    ],
    book: [
        { reg: /《/g, replacement: "<" },
        { reg: /》/g, replacement: ">" },
    ],
    backslash: [
        { reg: /、/g, replacement: "\\" },
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
    symbolCn: /[，。：；”…"《》、？【】『』、（）￥！・—]/g,
    characterEn: /[a-zA-Z]/g,
    characterCn: /[\u4e00-\u9fa5]/g
}

let textarea;
let currentLanguage = 'zh';

document.addEventListener('DOMContentLoaded', function () {
    textarea = $('#text');
    // Auto-detect language based on browser settings
    const browserLang = navigator.language || navigator.userLanguage;
    const lang = browserLang.startsWith('zh') ? 'zh' : 'en';
    setLanguage(lang);
    // Initialize textarea height
    autoResize(textarea);
});

function setLanguage(lang) {
    currentLanguage = lang;
    const texts = languageTexts[lang];

    for (const key in texts) {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = texts[key];
        }
    }
    
    // Update page title
    document.title = texts['title'];
}

function regReplace(regs) {
    regs.forEach(item => {
        // Create new RegExp object to ensure flags are properly set
        const reg = new RegExp(item.reg.source, item.reg.flags);
        textarea.value = textarea.value.replace(reg, item.replacement);
    });
    updateInfos();
}

function $(selector) {
    return document.querySelector(selector);
}

function updateInfos() {
    let countSymbolChinese = textarea.value.match(MATCH.symbolCn);
    let countSymbolEnglish = textarea.value.match(MATCH.symbolEn);
    let countCharacterEnglish = textarea.value.match(MATCH.characterEn);
    let countCharacterChinese = textarea.value.match(MATCH.characterCn);

    $('#tol').innerText = textarea.value.length;
    $('#symbolChinese').innerText = countSymbolChinese ? countSymbolChinese.length : 0;
    $('#symbolEnglish').innerText = countSymbolEnglish ? countSymbolEnglish.length : 0;
    $('#englishCharacter').innerText = countCharacterEnglish ? countCharacterEnglish.length : 0;
    $('#chineseCharacter').innerText = countCharacterChinese ? countCharacterChinese.length : 0;
}

function autoResize(element) {
    // Save current scroll position before any changes
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Reset height to auto to get the correct scrollHeight
    element.style.height = 'auto';
    // Set height to scrollHeight to fit content
    element.style.height = element.scrollHeight + 'px';

    // Restore scroll position immediately
    window.scrollTo(scrollLeft, scrollTop);

    // Use requestAnimationFrame to ensure scroll position is maintained
    // after browser's layout calculations
    requestAnimationFrame(() => {
        window.scrollTo(scrollLeft, scrollTop);
    });
}