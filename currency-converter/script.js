// API密钥和端点
const ZHIPU_API_KEY = 'fa198e102b4441368c5fd32c68bbf589.m78MpoR4G8iT8xkL';
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const FRANKFURTER_API_URL = 'https://api.frankfurter.app/latest';

// DOM元素
const inputAmount = document.getElementById('inputAmount'); // 智能输入
const targetCurrency = document.getElementById('targetCurrency');
const convertBtn = document.getElementById('convertBtn');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const resultText = document.getElementById('resultText');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

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
        'page-title': '智能汇率转换器',
        'app-title': '智能汇率转换器',
        'input-label': '输入金额（支持自然语言）：',
        'input-placeholder': '例如：234534韩元、234亿美元',
        'target-label': '目标货币：',
        'convert-btn': '开始转换',
        'loading-text': '正在处理中...',
        'result-title': '转换结果',
        'error-no-amount': '请输入有效的金额',
        'error-parse-failed': '无法解析输入内容，请确保格式正确',
        'error-model-failed': 'AI服务暂时不可用，请稍后再试',
        'error-rate-failed': '获取实时汇率失败，请检查网络',
        processing: '正在处理中...',
        copied: '已复制',
        format_numeric: '数字格式',
        format_with_units: '带单位格式',
        format_chinese: '中文数字',
        format_chinese_formal: '大写中文'
    },
    en: {
        'page-title': 'Smart Currency Converter',
        'app-title': 'Smart Currency Converter',
        'input-label': 'Enter amount (natural language):',
        'input-placeholder': 'e.g., 234534 KRW, 2 billion USD',
        'target-label': 'To:',
        'convert-btn': 'Convert Now',
        'loading-text': 'Processing...',
        'result-title': 'Conversion Result',
        'error-no-amount': 'Please enter a valid amount',
        'error-parse-failed': 'Unable to parse input. Please check the format.',
        'error-model-failed': 'AI Service unavailable. Please try again later.',
        'error-rate-failed': 'Failed to fetch exchange rates. Check connection.',
        processing: 'Processing...',
        copied: 'Copied',
        format_numeric: 'Numeric Format',
        format_with_units: 'With Units',
        format_chinese: 'Chinese Numerals',
        format_chinese_formal: 'Formal Chinese'
    }
};

let t = translations[currentLang];

const currencyNames = {
    zh: {
        'AUD': '澳大利亚元 (AUD)', 'BGN': '保加利亚列弗 (BGN)', 'BRL': '巴西雷亚尔 (BRL)',
        'CAD': '加拿大元 (CAD)', 'CHF': '瑞士法郎 (CHF)', 'CNY': '人民币 (CNY)',
        'CZK': '捷克克朗 (CZK)', 'DKK': '丹麦克朗 (DKK)', 'EUR': '欧元 (EUR)',
        'GBP': '英镑 (GBP)', 'HKD': '港元 (HKD)', 'HUF': '匈牙利福林 (HUF)',
        'IDR': '印尼盾 (IDR)', 'ILS': '以色列新谢克尔 (ILS)', 'INR': '印度卢比 (INR)',
        'ISK': '冰岛克朗 (ISK)', 'JPY': '日元 (JPY)', 'KRW': '韩元 (KRW)',
        'MXN': '墨西哥比索 (MXN)', 'MYR': '马来西亚林吉特 (MYR)', 'NOK': '挪威克朗 (NOK)',
        'NZD': '新西兰元 (NZD)', 'PHP': '菲律宾比索 (PHP)', 'PLN': '波兰兹罗提 (PLN)',
        'RON': '罗马尼亚列伊 (RON)', 'SEK': '瑞典克朗 (SEK)', 'SGD': '新加坡元 (SGD)',
        'THB': '泰铢 (THB)', 'TRY': '土耳其里拉 (TRY)', 'USD': '美元 (USD)',
        'ZAR': '南非兰特 (ZAR)'
    },
    en: {
        'AUD': 'Australian Dollar (AUD)', 'BGN': 'Bulgarian Lev (BGN)', 'BRL': 'Brazilian Real (BRL)',
        'CAD': 'Canadian Dollar (CAD)', 'CHF': 'Swiss Franc (CHF)', 'CNY': 'Chinese Yuan (CNY)',
        'CZK': 'Czech Koruna (CZK)', 'DKK': 'Danish Krone (DKK)', 'EUR': 'Euro (EUR)',
        'GBP': 'British Pound (GBP)', 'HKD': 'Hong Kong Dollar (HKD)', 'HUF': 'Hungarian Forint (HUF)',
        'IDR': 'Indonesian Rupiah (IDR)', 'ILS': 'Israeli New Shekel (ILS)', 'INR': 'Indian Rupee (INR)',
        'ISK': 'Icelandic Krona (ISK)', 'JPY': 'Japanese Yen (JPY)', 'KRW': 'South Korean Won (KRW)',
        'MXN': 'Mexican Peso (MXN)', 'MYR': 'Malaysian Ringgit (MYR)', 'NOK': 'Norwegian Krone (NOK)',
        'NZD': 'New Zealand Dollar (NZD)', 'PHP': 'Philippine Peso (PHP)', 'PLN': 'Polish Zloty (PLN)',
        'RON': 'Romanian Leu (RON)', 'SEK': 'Swedish Krona (SEK)', 'SGD': 'Singapore Dollar (SGD)',
        'THB': 'Thai Baht (THB)', 'TRY': 'Turkish Lira (TRY)', 'USD': 'US Dollar (USD)',
        'ZAR': 'South African Rand (ZAR)'
    }
};

function populateCurrencyOptions() {
    const currentCurrencyNames = currencyNames[currentLang];
    
    // 填充目标货币
    targetCurrency.innerHTML = '';

    Object.keys(currentCurrencyNames).forEach(currencyCode => {
        // 目标货币选项
        const optionT = document.createElement('option');
        optionT.value = currencyCode;
        optionT.textContent = currentCurrencyNames[currencyCode];
        targetCurrency.appendChild(optionT);
    });
    
    // 恢复上次选择
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

    const loadingText = document.getElementById('loading-text');
    if (loadingText && t['loading-text']) loadingText.textContent = t['loading-text'];

    populateCurrencyOptions();
    try { localStorage.setItem('lang', lang); } catch (e) {}
}

document.addEventListener('DOMContentLoaded', function() {
    applyLanguage(currentLang);
    
    convertBtn.addEventListener('click', convertCurrency);
    
    // 保存选择
    targetCurrency.addEventListener('change', () => {
        localStorage.setItem('targetCurrency', targetCurrency.value);
    });
});

async function convertCurrency() {
    const target = targetCurrency.value;
    let amount, currency;
    
    showLoading();
    
    try {
        // 智能模式：走大模型解析流程
        const userInput = inputAmount.value.trim();
        if (!userInput) throw new Error(t['error-no-amount']);
        
        const normalizedInput = await normalizeInput(userInput);
        const parsed = parseNormalizedInput(normalizedInput);
        amount = parsed.amount;
        currency = parsed.currency;
        
        if (!amount || !currency) {
            throw new Error(t['error-parse-failed']);
        }
        
        // 获取汇率并转换
        const convertedAmount = await getExchangeRate(currency, target, amount);
        
        // 显示结果
        showResult(amount, currency, convertedAmount, target);
        
    } catch (err) {
        showError(err.message);
    }
}

// 保持原有的 LLM 相关函数不变
async function normalizeInput(input) {
    const prompt = currentLang === 'zh' ? 
        `请将以下用户输入的货币金额转换为标准格式 "[数值][货币代码]" 的形式，只返回这个标准格式，不要其他内容。
示例：
用户输入："234534韩元" → 输出："234534KRW"
用户输入："234亿美元" → 输出："23400000000USD"
用户输入："二百万日元" → 输出："2000000JPY"
用户输入："${input}"
输出：` :
        `Please convert the following user input currency amount into the standard format "[value][currency code]", only return this standard format.
User input: "${input}"
Output:`;

    const response = await fetch(ZHIPU_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ZHIPU_API_KEY}`
        },
        body: JSON.stringify({
            model: 'glm-4.5-flash',
            messages: [
                { role: 'system', content: 'You are a helpful AI assistant specialized in standardizing currency amounts.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.1 // 降低温度以获得更确定的结果
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
    throw new Error(t['error-parse-failed']);
}

async function getExchangeRate(fromCurrency, toCurrency, amount) {
    if (fromCurrency === toCurrency) return amount;
    
    try {
        const response = await fetch(`${FRANKFURTER_API_URL}?from=${fromCurrency}&to=${toCurrency}`);
        if (!response.ok) throw new Error(t['error-rate-failed']);
        const data = await response.json();
        const rate = data.rates[toCurrency];
        return (amount * rate).toFixed(2);
    } catch (e) {
        throw new Error(t['error-rate-failed']);
    }
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
    if (lang === 'zh') {
        if (absNum >= 1e8) return (num / 1e8).toFixed(2) + '亿';
        if (absNum >= 1e4) return (num / 1e4).toFixed(2) + '万';
    } else {
        if (absNum >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (absNum >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (absNum >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(2);
}

function formatChineseNumerals(num) {
    // (简化版，保持原逻辑基本不变，仅作代码整理)
    const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千'];
    const bigUnits = ['', '万', '亿'];
    if (num === 0) return chineseNums[0];
    let integerPart = Math.floor(Math.abs(num));
    let decimalPart = Math.round((Math.abs(num) - integerPart) * 100);
    
    function convertInteger(n) {
        if (n === 0) return '';
        let result = '';
        let bigUnitIndex = 0;
        while (n > 0) {
            let part = n % 10000;
            if (part !== 0) {
                let partStr = '';
                let temp = part;
                let uIndex = 0;
                while (temp > 0) {
                    let digit = temp % 10;
                    if (digit !== 0) partStr = chineseNums[digit] + units[uIndex] + partStr;
                    else if (partStr !== '' && !partStr.startsWith(chineseNums[0])) partStr = chineseNums[0] + partStr;
                    temp = Math.floor(temp / 10);
                    uIndex++;
                }
                result = partStr + bigUnits[bigUnitIndex] + result;
            }
            n = Math.floor(n / 10000);
            bigUnitIndex++;
        }
        // 修正一十开头
        if (result.startsWith('一十')) result = result.substring(1);
        return result || chineseNums[0];
    }
    
    let result = convertInteger(integerPart);
    if (decimalPart > 0) {
        result += '点' + chineseNums[Math.floor(decimalPart/10)] + chineseNums[decimalPart%10];
    }
    return num < 0 ? '负' + result : result;
}

function formatFormalChinese(num) {
    const formalNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const formalUnits = ['', '拾', '佰', '仟'];
    const formalBigUnits = ['', '万', '亿'];
    if (num === 0) return '零元整';
    let integerPart = Math.floor(Math.abs(num));
    let decimalPart = Math.round((Math.abs(num) - integerPart) * 100);
    
    function convertInteger(n) {
        if (n === 0) return '';
        let result = '';
        let bigUnitIndex = 0;
        while (n > 0) {
            let part = n % 10000;
            if (part !== 0) {
                let partStr = '';
                let temp = part;
                let uIndex = 0;
                while (temp > 0) {
                    let digit = temp % 10;
                    if (digit !== 0) partStr = formalNums[digit] + formalUnits[uIndex] + partStr;
                    else if (partStr !== '' && !partStr.startsWith(formalNums[0])) partStr = formalNums[0] + partStr;
                    temp = Math.floor(temp / 10);
                    uIndex++;
                }
                result = partStr + formalBigUnits[bigUnitIndex] + result;
            }
            n = Math.floor(n / 10000);
            bigUnitIndex++;
        }
        return result;
    }
    
    let result = convertInteger(integerPart);
    result += result ? '元' : '';
    if (decimalPart > 0) {
        if (Math.floor(decimalPart/10) > 0) result += formalNums[Math.floor(decimalPart/10)] + '角';
        if (decimalPart%10 > 0) result += formalNums[decimalPart%10] + '分';
    } else {
        result += '整';
    }
    return num < 0 ? '负' + result : result;
}

function showLoading() {
    loading.style.display = 'block';
    result.style.display = 'none';
    error.style.display = 'none';
    convertBtn.disabled = true;
    convertBtn.style.opacity = '0.7';
}

function hideLoading() {
    loading.style.display = 'none';
    convertBtn.disabled = false;
    convertBtn.style.opacity = '1';
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
    hideLoading();
    const convertedNum = parseFloat(convertedAmount);
    resultText.innerHTML = '';

    const formats = [
        { title: t.format_numeric, val: formatNumber(convertedNum, currentLang) },
        { title: t.format_with_units, val: formatWithUnits(convertedNum, currentLang) }
    ];

    if (currentLang === 'zh') {
        formats.push({ title: t.format_chinese, val: formatChineseNumerals(convertedNum) });
        formats.push({ title: t.format_chinese_formal, val: formatFormalChinese(convertedNum) });
    }

    formats.forEach(f => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.cursor = 'pointer';
        
        const title = document.createElement('h4');
        title.textContent = f.title;
        
        const value = document.createElement('p');
        value.className = 'value';
        value.textContent = f.val;
        
        // 点击整个卡片复制内容
        card.addEventListener('click', () => {
            copyToClipboard(f.val);
        });
        
        card.appendChild(title);
        card.appendChild(value);
        resultText.appendChild(card);
    });

    result.style.display = 'block';
}

function showError(message) {
    hideLoading();
    errorMessage.textContent = message;
    error.style.display = 'flex';
}