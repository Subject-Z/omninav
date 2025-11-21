// API密钥和端点
const ZHIPU_API_KEY = 'fa198e102b4441368c5fd32c68bbf589.m78MpoR4G8iT8xkL';
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const FRANKFURTER_API_URL = 'https://api.frankfurter.app/latest';

let exchangeRates = null;
let ratesDate = null;

// DOM元素
const inputAmount = document.getElementById('inputAmount'); // 智能输入
const sourceCurrency = document.getElementById('sourceCurrency'); // 源货币
const targetCurrency = document.getElementById('targetCurrency');
const convertBtn = document.getElementById('convertBtn');
const result = document.getElementById('result');
const resultText = document.getElementById('resultText');
const lastUpdateTime = document.getElementById('lastUpdateTime');

// 语言检测与翻译数据
function detectLanguage() {
    try {
        const saved = localStorage.getItem('lang');
        if (saved) {
            const s = String(saved).toLowerCase();
            return s.startsWith('zh') ? 'zh' : 'en';
        }
    } catch (e) {}

    const navs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || navigator.userLanguage || 'en'];
    for (const n of navs) {
        if (!n) continue;
        const s = String(n).toLowerCase();
        if (s.startsWith('zh')) return 'zh';
    }
    return 'en';
}

let currentLang = detectLanguage();

const translations = {
    zh: {
        'page-title': '汇率换算',
        'app-title': '汇率换算',
        'source-label': '源货币：',
        'input-label': '输入金额（支持自然语言）：',
        'input-placeholder': '任意文本，例如：234亿、两百、435',
        'numeric-label': '仅数字：',
        'target-label': '目标货币：',
        'convert-btn': '换算',
        'result-title': '转换结果',
        'error-model-failed': '服务暂时不可用，请稍后再试',
        processing: '正在处理中...',
        copied: '已复制',
        'rate-date-label': '汇率数据日期：'
    },
    en: {
        'page-title': 'Currency Conversion',
        'app-title': 'Currency Conversion',
        'source-label': 'From:',
        'input-label': 'Enter amount (natural language):',
        'input-placeholder': 'Any text, e.g., 2 billion, two hundred, 435',
        'numeric-label': 'Numbers only:',
        'target-label': 'To:',
        'convert-btn': 'Convert',
        'result-title': 'Conversion Result',
        'error-model-failed': 'Service temporarily unavailable, please try again later.',
        processing: 'Processing...',
        copied: 'Copied',
        'rate-date-label': 'Exchange rate date: '
    }
};

let t = translations[currentLang];

const currencyNames = {
    zh: {
        'AUD': 'AUD 澳大利亚元', 'BGN': 'BGN 保加利亚列弗', 'BRL': 'BRL 巴西雷亚尔',
        'CAD': 'CAD 加拿大元', 'CHF': 'CHF 瑞士法郎', 'CNY': 'CNY 人民币',
        'CZK': 'CZK 捷克克朗', 'DKK': 'DKK 丹麦克朗', 'EUR': 'EUR 欧元',
        'GBP': 'GBP 英镑', 'HKD': 'HKD 港元', 'HUF': 'HUF 匈牙利福林',
        'IDR': 'IDR 印尼盾', 'ILS': 'ILS 以色列新谢克尔', 'INR': 'INR 印度卢比',
        'ISK': 'ISK 冰岛克朗', 'JPY': 'JPY 日元', 'KRW': 'KRW 韩元',
        'MXN': 'MXN 墨西哥比索', 'MYR': 'MYR 马来西亚林吉特', 'NOK': 'NOK 挪威克朗',
        'NZD': 'NZD 新西兰元', 'PHP': 'PHP 菲律宾比索', 'PLN': 'PLN 波兰兹罗提',
        'RON': 'RON 罗马尼亚列伊', 'SEK': 'SEK 瑞典克朗', 'SGD': 'SGD 新加坡元',
        'THB': 'THB 泰铢', 'TRY': 'TRY 土耳其里拉', 'USD': 'USD 美元',
        'ZAR': 'ZAR 南非兰特'
    },
    en: {
        'AUD': 'AUD Australian Dollar', 'BGN': 'BGN Bulgarian Lev', 'BRL': 'BRL Brazilian Real',
        'CAD': 'CAD Canadian Dollar', 'CHF': 'CHF Swiss Franc', 'CNY': 'CNY Chinese Yuan',
        'CZK': 'CZK Czech Koruna', 'DKK': 'DKK Danish Krone', 'EUR': 'EUR Euro',
        'GBP': 'GBP British Pound', 'HKD': 'HKD Hong Kong Dollar', 'HUF': 'HUF Hungarian Forint',
        'IDR': 'IDR Indonesian Rupiah', 'ILS': 'ILS Israeli New Shekel', 'INR': 'INR Indian Rupee',
        'ISK': 'ISK Icelandic Krona', 'JPY': 'JPY Japanese Yen', 'KRW': 'KRW South Korean Won',
        'MXN': 'MXN Mexican Peso', 'MYR': 'MYR Malaysian Ringgit', 'NOK': 'NOK Norwegian Krone',
        'NZD': 'NZD New Zealand Dollar', 'PHP': 'PHP Philippine Peso', 'PLN': 'PLN Polish Zloty',
        'RON': 'RON Romanian Leu', 'SEK': 'SEK Swedish Krona', 'SGD': 'SGD Singapore Dollar',
        'THB': 'THB Thai Baht', 'TRY': 'TRY Turkish Lira', 'USD': 'USD US Dollar',
        'ZAR': 'ZAR South African Rand'
    }
};

function populateCurrencyOptions() {
    const currentCurrencyNames = currencyNames[currentLang];
    
    // 填充源货币
    sourceCurrency.innerHTML = '';
    // 填充目标货币
    targetCurrency.innerHTML = '';

    Object.keys(currentCurrencyNames).forEach(currencyCode => {
        // 源货币选项
        const optionS = document.createElement('option');
        optionS.value = currencyCode;
        optionS.textContent = currentCurrencyNames[currencyCode];
        sourceCurrency.appendChild(optionS);
        
        // 目标货币选项
        const optionT = document.createElement('option');
        optionT.value = currencyCode;
        optionT.textContent = currentCurrencyNames[currencyCode];
        targetCurrency.appendChild(optionT);
    });
    
    // 恢复上次选择
    const savedSource = localStorage.getItem('sourceCurrency');
    if (savedSource && currencyNames[currentLang][savedSource]) {
        sourceCurrency.value = savedSource;
    } else {
        // 默认选择人民币
        sourceCurrency.value = 'CNY';
    }
    
    const savedTarget = localStorage.getItem('targetCurrency');
    if (savedTarget && currencyNames[currentLang][savedTarget]) {
        targetCurrency.value = savedTarget;
    }
}

function applyLanguage(lang) {
    currentLang = lang;
    t = translations[lang] || translations.en;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    
    if (t['page-title']) document.title = t['page-title'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });


    populateCurrencyOptions();
    try { localStorage.setItem('lang', lang); } catch (e) {}
}

document.addEventListener('DOMContentLoaded', function() {
    applyLanguage(currentLang);
    
    // 页面加载后立即预加载汇率数据
    preloadExchangeRates();
    
    // 初始化默认显示0的结果
    showDefaultResult();
    
    convertBtn.addEventListener('click', convertCurrency);
    
    // 保存选择
    sourceCurrency.addEventListener('change', () => {
        localStorage.setItem('sourceCurrency', sourceCurrency.value);
    });
    targetCurrency.addEventListener('change', () => {
        localStorage.setItem('targetCurrency', targetCurrency.value);
    });
    
    // 添加键盘事件监听器，支持Enter键触发换算
    inputAmount.addEventListener('keydown', handleKeyDown);
    sourceCurrency.addEventListener('keydown', handleKeyDown);
    targetCurrency.addEventListener('keydown', handleKeyDown);
});

async function convertCurrency() {
    const source = sourceCurrency.value;
    const target = targetCurrency.value;
    let amount, currency;
    
    // 禁用按钮并改变背景色
    convertBtn.disabled = true;
    convertBtn.style.backgroundColor = '#9ca3af'; // 灰色
    
    try {
        // 智能模式：走大模型解析流程
        const userInput = inputAmount.value.trim();
        if (!userInput) throw new Error(t['error-model-failed']);
        
        let amount, currency;
        if (/^\s*\d+(\.\d+)?\s*$/.test(userInput)) {
            amount = parseFloat(userInput);
            currency = source;
            if (isNaN(amount) || amount <= 0) {
                throw new Error(t['error-model-failed']);
            }
        } else {
            const normalizedInput = await normalizeInput(userInput, source);
            const parsed = parseNormalizedInput(normalizedInput);
            amount = parsed.amount;
            currency = parsed.currency;
            if (!currency) {
                currency = source;
            }
        }
        
        if (!amount || !currency) {
            throw new Error(t['error-model-failed']);
        }
        
        // 获取汇率并转换
        const convertedAmount = await getExchangeRate(currency, target, amount);
        
        // 显示结果
        showResult(amount, currency, convertedAmount, target);
        
    } catch (err) {
        showError(err.message);
    } finally {
        // 恢复按钮状态
        convertBtn.disabled = false;
        convertBtn.style.backgroundColor = ''; // 恢复默认颜色
    }
}


// 处理键盘事件，支持Enter键触发换算
function handleKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // 防止表单提交或其他默认行为
        convertCurrency();
    }
}

// 显示默认结果（0）
function showDefaultResult() {
    const convertedNum = 0;
    resultText.innerHTML = '';

    const formats = [
        { val: formatNumber(convertedNum, currentLang) },
        { val: formatWithUnits(convertedNum, currentLang) }
    ];

    formats.forEach(f => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.cursor = 'pointer';
        
        const value = document.createElement('p');
        value.className = 'value';
        value.textContent = f.val;
        
        // 点击整个卡片复制内容
        card.addEventListener('click', () => {
            copyToClipboard(f.val);
        });
        
        card.appendChild(value);
        resultText.appendChild(card);
    });

    result.style.display = 'block';
}

// 保持原有的 LLM 相关函数不变
async function normalizeInput(input, sourceCurrency) {
    const systemPrompt = `请将用户输入的货币金额转换为标准格式 "[数值][货币代码]" 的形式，只返回这个标准格式，不要其他内容。

默认源货币代码：\${sourceCurrency}

规则：
1. 如果用户输入明确包含货币名称或代码（如“美元”、“USD”、“韩元”、“日元”），则解析并使用该货币代码。
2. 如果用户输入没有指定任何货币（如纯数字、"两亿"、"100"），则使用默认源货币代码 \${sourceCurrency}。

示例：
用户输入："234534韩元" → "234534KRW"
用户输入："234亿美元" → "23400000000USD"
用户输入："二百万日元" → "2000000JPY"
用户输入："两亿" → "200000000\${sourceCurrency}"
用户输入："100" → "100\${sourceCurrency}"`;

    const userPrompt = `${input}`;

    const response = await fetch(ZHIPU_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ZHIPU_API_KEY}`
        },
        body: JSON.stringify({
            model: 'glm-4.5-flash',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            thinking: {
                type: "disabled"    // 禁用深度思考模式
            },
            temperature: 1
        })
    });

    if (!response.ok) throw new Error(t['error-model-failed']);
    const data = await response.json();
    return data.choices[0].message.content.trim();
}

function parseNormalizedInput(normalized) {
    const regex = /^([0-9.]+)([A-Z]{3})$/;
    const match = normalized.match(regex);
    if (match) {
        return { amount: parseFloat(match[1]), currency: match[2] };
    }
    // Fallback: if pure number without currency code, return amount with null currency
    const trimmed = normalized.trim();
    const num = parseFloat(trimmed);
    if (!isNaN(num) && num > 0) {
        return { amount: num, currency: null };
    }
    throw new Error(t['error-model-failed']);
}

async function getExchangeRate(fromCurrency, toCurrency, amount) {
    if (fromCurrency === toCurrency) return amount;
    
    // 优先使用预加载的缓存汇率
    if (exchangeRates && ratesDate && exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
        const rateFrom = exchangeRates[fromCurrency];
        const rateTo = exchangeRates[toCurrency];
        updateLastUpdateTime(ratesDate);
        return (amount * (rateTo / rateFrom)).toFixed(2);
    }
    
    // 回退到实时获取特定货币对汇率
    try {
        const response = await fetch(`${FRANKFURTER_API_URL}?from=${fromCurrency}&to=${toCurrency}`);
        if (!response.ok) throw new Error(t['error-model-failed']);
        const data = await response.json();
        const rate = data.rates[toCurrency];
        
        // 更新最后获取时间
        updateLastUpdateTime(data.date);
        
        return (amount * rate).toFixed(2);
    } catch (e) {
        throw new Error(t['error-model-failed']);
    }
}

// 获取汇率数据日期（用于页面加载时显示）
async function preloadExchangeRates() {
    try {
        const response = await fetch(FRANKFURTER_API_URL);
        if (!response.ok) throw new Error(t['error-rate-failed']);
        const data = await response.json();
        exchangeRates = data.rates;
        ratesDate = data.date;
        updateLastUpdateTime(ratesDate);
    } catch (e) {
        // 如果获取失败，显示当前日期作为备用
        updateLastUpdateTime(new Date().toISOString().split('T')[0]);
    }
}

function updateLastUpdateTime(dateString) {
    // 格式化日期显示
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(currentLang === 'zh' ? 'zh-CN' : 'en-US');
    lastUpdateTime.textContent = `${t['rate-date-label'] || (currentLang === 'zh' ? '汇率数据日期：' : 'Exchange rate date: ')}${formattedDate}`;
}

// 数字格式化辅助函数
function formatNumber(num, lang) {
    const n = Number(num);
    if (Number.isNaN(n)) return String(num);
    const abs = Math.abs(n);
    const fixed = abs.toFixed(2);
    let [intPart, decPart] = fixed.split('.');
    if (lang === 'zh') {
        intPart = intPart.replace(/\B(?=(\d{4})+(?!\d))/g, "'");
    } else {
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return (n < 0 ? '-' : '') + intPart + '.' + decPart;
}

function formatWithUnits(num, lang) {
    const absNum = Math.abs(num);
    const formatOneDecimal = (n) => {
        const fixed = n.toFixed(1);
        return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
    };
    if (lang === 'zh') {
        if (absNum >= 1e12) return formatOneDecimal(num / 1e12) + '万亿';
        if (absNum >= 1e8) return formatOneDecimal(num / 1e8) + '亿';
        if (absNum >= 1e4) return formatOneDecimal(num / 1e4) + '万';
    } else {
        if (absNum >= 1e12) return formatOneDecimal(num / 1e12) + 'T';
        if (absNum >= 1e9) return formatOneDecimal(num / 1e9) + 'B';
        if (absNum >= 1e6) return formatOneDecimal(num / 1e6) + 'M';
        if (absNum >= 1e3) return formatOneDecimal(num / 1e3) + 'K';
    }
    return formatOneDecimal(num);
}



async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        // 显示复制成功提示
        showCopyFeedback();
    } catch (err) {
        console.error('复制失败:', err);
    }
}

function showCopyFeedback() {
    // 创建临时提示元素
    const feedback = document.createElement('div');
    feedback.textContent = t.copied;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-bg);
        color: var(--success-text);
        padding: 10px 15px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    // 2秒后移除提示
    setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

function showResult(originalAmount, originalCurrency, convertedAmount, targetCurrency) {
    const convertedNum = parseFloat(convertedAmount);
    resultText.innerHTML = '';

    const formats = [
        { val: formatNumber(convertedNum, currentLang) },
        { val: formatWithUnits(convertedNum, currentLang) }
    ];

    formats.forEach(f => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.cursor = 'pointer';
        
        const value = document.createElement('p');
        value.className = 'value';
        value.textContent = f.val;
        
        // 点击整个卡片复制内容
        card.addEventListener('click', () => {
            copyToClipboard(f.val);
        });
        
        card.appendChild(value);
        resultText.appendChild(card);
    });

    result.style.display = 'block';
}

function showError(message) {
    const mainWrapper = document.querySelector('.main-wrapper');
    
    // Remove existing error message if any
    const existing = mainWrapper ? mainWrapper.querySelector('.error-message') : null;
    if (existing) {
        existing.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        margin: 20px 0;
        padding: 12px 20px;
        background: var(--error-bg);
        color: var(--error-text);
        border-radius: 8px;
        font-size: 14px;
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 100%;
    `;
    
    if (mainWrapper) {
        mainWrapper.appendChild(errorDiv);
        
        // Fade in
        requestAnimationFrame(() => {
            errorDiv.style.opacity = '1';
        });
        
        // Fade out after 4 seconds
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 4000);
    }
}