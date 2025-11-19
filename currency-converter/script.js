// API密钥和端点
const ZHIPU_API_KEY = 'fa198e102b4441368c5fd32c68bbf589.m78MpoR4G8iT8xkL';
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const FRANKFURTER_API_URL = 'https://api.frankfurter.app/latest';

// DOM元素（脚本在 body 末尾加载，元素应该已存在）
const inputAmount = document.getElementById('inputAmount');
const targetCurrency = document.getElementById('targetCurrency');
const convertBtn = document.getElementById('convertBtn');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const resultText = document.getElementById('resultText');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

// 语言检测与翻译数据
function detectLanguage() {
    // 优先使用用户显式保存的语言偏好（localStorage），并规范化为 'zh' 或 'en'
    try {
        const saved = localStorage.getItem('lang');
        if (saved) {
            const s = String(saved).toLowerCase();
            return s.startsWith('zh') ? 'zh' : 'en';
        }
    } catch (e) {
        // ignore
    }

    // 尝试使用 navigator.languages（首选项数组），然后回退到 navigator.language
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
        'input-label': '输入金额（可使用自然语言）：',
        'input-placeholder': '例如：234534韩元、234亿美元、二百万日元',
        'target-label': '目标货币：',
        'convert-btn': '转换',
        'loading-text': '正在处理中...',
        'result-title': '转换结果：',
        'error-no-amount': '请输入金额',
        'error-parse-failed': '无法解析输入内容，请提供有效的金额和货币',
        'error-model-failed': '大模型处理失败',
        'error-rate-failed': '获取汇率失败',
        processing: '正在处理中...',
        result_template: (originalAmount, originalCurrency, convertedAmount, targetCurrency) =>
            `<strong>${originalAmount} ${originalCurrency}</strong> 等于 <strong>${convertedAmount} ${targetCurrency}</strong>`,
        copy_btn: '复制',
        copied: '已复制',
        format_numeric: '数字格式',
        format_with_units: '带单位格式',
        format_chinese: '中文数字',
        format_chinese_formal: '大写中文'
    },
    en: {
        'page-title': 'Smart Currency Converter',
        'app-title': 'Smart Currency Converter',
        'input-label': 'Enter amount (natural language supported):',
        'input-placeholder': 'Example: 234534 KRW, 234 billion USD, 2 million JPY',
        'target-label': 'Target Currency:',
        'convert-btn': 'Convert',
        'loading-text': 'Processing...',
        'result-title': 'Conversion Result:',
        'error-no-amount': 'Please enter an amount',
        'error-parse-failed': 'Unable to parse input, please provide valid amount and currency',
        'error-model-failed': 'Model processing failed',
        'error-rate-failed': 'Failed to get exchange rate',
        processing: 'Processing...',
        result_template: (originalAmount, originalCurrency, convertedAmount, targetCurrency) =>
            `<strong>${originalAmount} ${originalCurrency}</strong> equals <strong>${convertedAmount} ${targetCurrency}</strong>`,
        copy_btn: 'Copy',
        copied: 'Copied',
        format_numeric: 'Numeric Format',
        format_with_units: 'With Units',
        format_chinese: 'Chinese Numerals',
        format_chinese_formal: 'Formal Chinese'
    }
};

let t = translations[currentLang];

// 添加货币名称翻译
const currencyNames = {
    zh: {
        'AUD': '澳大利亚元 (AUD)',
        'BGN': '保加利亚列弗 (BGN)',
        'BRL': '巴西雷亚尔 (BRL)',
        'CAD': '加拿大元 (CAD)',
        'CHF': '瑞士法郎 (CHF)',
        'CNY': '人民币 (CNY)',
        'CZK': '捷克克朗 (CZK)',
        'DKK': '丹麦克朗 (DKK)',
        'EUR': '欧元 (EUR)',
        'GBP': '英镑 (GBP)',
        'HKD': '港元 (HKD)',
        'HUF': '匈牙利福林 (HUF)',
        'IDR': '印尼盾 (IDR)',
        'ILS': '以色列新谢克尔 (ILS)',
        'INR': '印度卢比 (INR)',
        'ISK': '冰岛克朗 (ISK)',
        'JPY': '日元 (JPY)',
        'KRW': '韩元 (KRW)',
        'MXN': '墨西哥比索 (MXN)',
        'MYR': '马来西亚林吉特 (MYR)',
        'NOK': '挪威克朗 (NOK)',
        'NZD': '新西兰元 (NZD)',
        'PHP': '菲律宾比索 (PHP)',
        'PLN': '波兰兹罗提 (PLN)',
        'RON': '罗马尼亚列伊 (RON)',
        'SEK': '瑞典克朗 (SEK)',
        'SGD': '新加坡元 (SGD)',
        'THB': '泰铢 (THB)',
        'TRY': '土耳其里拉 (TRY)',
        'USD': '美元 (USD)',
        'ZAR': '南非兰特 (ZAR)'
    },
    en: {
        'AUD': 'Australian Dollar (AUD)',
        'BGN': 'Bulgarian Lev (BGN)',
        'BRL': 'Brazilian Real (BRL)',
        'CAD': 'Canadian Dollar (CAD)',
        'CHF': 'Swiss Franc (CHF)',
        'CNY': 'Chinese Yuan (CNY)',
        'CZK': 'Czech Koruna (CZK)',
        'DKK': 'Danish Krone (DKK)',
        'EUR': 'Euro (EUR)',
        'GBP': 'British Pound (GBP)',
        'HKD': 'Hong Kong Dollar (HKD)',
        'HUF': 'Hungarian Forint (HUF)',
        'IDR': 'Indonesian Rupiah (IDR)',
        'ILS': 'Israeli New Shekel (ILS)',
        'INR': 'Indian Rupee (INR)',
        'ISK': 'Icelandic Krona (ISK)',
        'JPY': 'Japanese Yen (JPY)',
        'KRW': 'South Korean Won (KRW)',
        'MXN': 'Mexican Peso (MXN)',
        'MYR': 'Malaysian Ringgit (MYR)',
        'NOK': 'Norwegian Krone (NOK)',
        'NZD': 'New Zealand Dollar (NZD)',
        'PHP': 'Philippine Peso (PHP)',
        'PLN': 'Polish Zloty (PLN)',
        'RON': 'Romanian Leu (RON)',
        'SEK': 'Swedish Krona (SEK)',
        'SGD': 'Singapore Dollar (SGD)',
        'THB': 'Thai Baht (THB)',
        'TRY': 'Turkish Lira (TRY)',
        'USD': 'US Dollar (USD)',
        'ZAR': 'South African Rand (ZAR)'
    }
};

function populateCurrencyOptions() {
    // 清空现有选项
    targetCurrency.innerHTML = '';
    
    // 获取当前语言的货币名称
    const currentCurrencyNames = currencyNames[currentLang];
    
    // 添加选项
    Object.keys(currentCurrencyNames).forEach(currencyCode => {
        const option = document.createElement('option');
        option.value = currencyCode;
        option.textContent = currentCurrencyNames[currencyCode];
        targetCurrency.appendChild(option);
    });
    
    // 恢复上次选择的货币
    const savedCurrency = localStorage.getItem('targetCurrency');
    if (savedCurrency && currencyNames[currentLang][savedCurrency]) {
        targetCurrency.value = savedCurrency;
    }
}

function applyLanguage(lang) {
    currentLang = lang;
    t = translations[lang] || translations.en;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    // 页面 title
    if (t['page-title']) document.title = t['page-title'];

    // 替换所有 data-i18n 文本
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    // 占位符替换
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });

    // 更新加载区文本（有独立 id）
    const loadingText = document.getElementById('loading-text');
    if (loadingText && t['loading-text']) loadingText.textContent = t['loading-text'];

    // 更新货币下拉列表
    populateCurrencyOptions();

    // persist selection
    try { localStorage.setItem('lang', lang); } catch (e) {}
}

// 初始化语言显示
document.addEventListener('DOMContentLoaded', function() {
    applyLanguage(currentLang);
});

// 事件监听器
document.addEventListener('DOMContentLoaded', function() {
    convertBtn.addEventListener('click', convertCurrency);
});
// 保存用户选择的目标货币
targetCurrency.addEventListener('change', () => {
    try {
        localStorage.setItem('targetCurrency', targetCurrency.value);
    } catch (e) {
        console.warn('无法保存目标货币到localStorage');
    }
});

async function convertCurrency() {
    const userInput = inputAmount.value.trim();
    const target = targetCurrency.value;
    
    if (!userInput) {
        showError(t.error_no_amount);
        return;
    }
    
    showLoading();
    
    try {
        // 第一步：使用大模型规范化用户输入
        const normalizedInput = await normalizeInput(userInput);
        
        // 第二步：提取数值和货币代码
        const { amount, currency } = parseNormalizedInput(normalizedInput);
        
        if (!amount || !currency) {
            throw new Error(t.error_parse_failed);
        }
        
        // 第三步：获取汇率并转换
        const convertedAmount = await getExchangeRate(currency, target, amount);
        
        // 显示结果
        showResult(amount, currency, convertedAmount, target);
    } catch (err) {
        showError(err.message);
    }
}

async function normalizeInput(input) {
    const prompt = currentLang === 'zh' ? 
        `请将以下用户输入的货币金额转换为标准格式 "[数值][货币代码]" 的形式，只返回这个标准格式，不要其他内容。
示例：
用户输入："234534韩元" → 输出："234534KRW"
用户输入："234亿美元" → 输出："23400000000USD"
用户输入："二百万日元" → 输出："2000000JPY"

用户输入："${input}"
输出：` :
        `Please convert the following user input currency amount into the standard format "[value][currency code]", only return this standard format, no other content.
Examples:
User input: "234534 Korean won" → Output: "234534KRW"
User input: "23.4 billion US dollars" → Output: "23400000000USD"
User input: "two million yen" → Output: "2000000JPY"

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
                {
                    role: 'system',
                    content: currentLang === 'zh' ? 
                        '你是一个有用的AI助手，专门用于处理货币金额的标准化。' : 
                        'You are a helpful AI assistant specialized in standardizing currency amounts.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 1.0,
            thinking: {
                type: 'disabled'
            }
        })
    });

    if (!response.ok) {
        throw new Error(t.error_model_failed);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

function parseNormalizedInput(normalized) {
    // 匹配数值和货币代码的正则表达式
    const regex = /^([0-9.]+)([A-Z]{3})$/;
    const match = normalized.match(regex);
    
    if (match) {
        return {
            amount: parseFloat(match[1]),
            currency: match[2]
        };
    }
    
    throw new Error(t.error_parse_failed);
}

async function getExchangeRate(fromCurrency, toCurrency, amount) {
    // 如果源货币和目标货币相同，则直接返回原金额
    if (fromCurrency === toCurrency) {
        return amount;
    }
    
    const response = await fetch(`${FRANKFURTER_API_URL}?from=${fromCurrency}&to=${toCurrency}`);
    
    if (!response.ok) {
        throw new Error(t.error_rate_failed);
    }
    
    const data = await response.json();
    const rate = data.rates[toCurrency];
    
    return (amount * rate).toFixed(2);
}

// 数字格式化函数
function formatNumber(num, lang) {
    // 统一把输入处理为 Number，并使用两位小数显示货币金额
    const n = Number(num);
    if (Number.isNaN(n)) return String(num);

    const negative = n < 0;
    const abs = Math.abs(n);
    // 保留两位小数（货币通常保留两位）
    const fixed = abs.toFixed(2); // string like "12345.67"
    let [intPart, decPart] = fixed.split('.');

    if (lang === 'zh') {
        // 中文环境按万位（每4位）分隔，使用中文万位分隔符'
        intPart = intPart.replace(/\B(?=(\d{4})+(?!\d))/g, "'");
    } else {
        // 其他（默认英文）按千位（每3位）分隔
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return (negative ? '-' : '') + intPart + (decPart ? '.' + decPart : '');
}

// 带单位格式化函数
function formatWithUnits(num, lang) {
    if (lang === 'zh') {
        const absNum = Math.abs(num);
        if (absNum >= 1e8) {
            return (num / 1e8).toFixed(absNum % 1e8 === 0 ? 0 : 2) + '亿';
        } else if (absNum >= 1e4) {
            return (num / 1e4).toFixed(absNum % 1e4 === 0 ? 0 : 2) + '万';
        } else {
            return num.toString();
        }
    } else {
        const absNum = Math.abs(num);
        if (absNum >= 1e9) {
            return (num / 1e9).toFixed(absNum % 1e9 === 0 ? 0 : 2) + 'B';
        } else if (absNum >= 1e6) {
            return (num / 1e6).toFixed(absNum % 1e6 === 0 ? 0 : 2) + 'M';
        } else if (absNum >= 1e3) {
            return (num / 1e3).toFixed(absNum % 1e3 === 0 ? 0 : 2) + 'K';
        } else {
            return num.toString();
        }
    }
}

// 中文数字格式化函数
function formatChineseNumerals(num) {
    const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千'];
    const bigUnits = ['', '万', '亿'];
    
    if (num === 0) return chineseNums[0];
    
    let integerPart = Math.floor(Math.abs(num));
    let decimalPart = Math.round((Math.abs(num) - integerPart) * 100);
    
    function convertInteger(n) {
        if (n === 0) return '';
        
        let result = '';
        let unitIndex = 0;
        let bigUnitIndex = 0;
        
        while (n > 0) {
            let part = n % 10000;
            if (part !== 0) {
                let partStr = '';
                let temp = part;
                let uIndex = 0;
                
                while (temp > 0) {
                    let digit = temp % 10;
                    if (digit !== 0) {
                        partStr = chineseNums[digit] + units[uIndex] + partStr;
                    } else if (partStr !== '') {
                        partStr = chineseNums[0] + partStr;
                    }
                    temp = Math.floor(temp / 10);
                    uIndex++;
                }
                
                result = partStr + bigUnits[bigUnitIndex] + result;
            } else if (result !== '') {
                result = chineseNums[0] + result;
            }
            
            n = Math.floor(n / 10000);
            bigUnitIndex++;
        }
        
        // 处理特殊情况：10-19
        if (result.startsWith(chineseNums[1] + units[1]) && result.length > 2) {
            result = result.substring(1);
        }
        
        return result;
    }
    
    let result = convertInteger(integerPart);
    
    if (decimalPart > 0) {
        let decimalStr = '';
        let tenths = Math.floor(decimalPart / 10);
        let hundredths = decimalPart % 10;
        
        if (tenths > 0) {
            decimalStr += chineseNums[tenths] + '角';
        }
        if (hundredths > 0) {
            decimalStr += chineseNums[hundredths] + '分';
        }
        
        result += '点' + decimalStr;
    }
    
    return num < 0 ? '负' + result : result;
}

// 大写中文格式化函数
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
        let unitIndex = 0;
        let bigUnitIndex = 0;
        
        while (n > 0) {
            let part = n % 10000;
            if (part !== 0) {
                let partStr = '';
                let temp = part;
                let uIndex = 0;
                
                while (temp > 0) {
                    let digit = temp % 10;
                    if (digit !== 0) {
                        partStr = formalNums[digit] + formalUnits[uIndex] + partStr;
                    } else if (partStr !== '') {
                        partStr = formalNums[0] + partStr;
                    }
                    temp = Math.floor(temp / 10);
                    uIndex++;
                }
                
                result = partStr + formalBigUnits[bigUnitIndex] + result;
            } else if (result !== '') {
                result = formalNums[0] + result;
            }
            
            n = Math.floor(n / 10000);
            bigUnitIndex++;
        }
        
        // 处理特殊情况：10-19
        if (result.startsWith(formalNums[1] + formalUnits[1]) && result.length > 2) {
            result = result.substring(1);
        }
        
        return result;
    }
    
    let result = convertInteger(integerPart);
    
    if (result !== '') {
        result += '元';
    }
    
    if (decimalPart > 0) {
        let tenths = Math.floor(decimalPart / 10);
        let hundredths = decimalPart % 10;
        
        if (tenths > 0) {
            result += formalNums[tenths] + '角';
        }
        if (hundredths > 0) {
            result += formalNums[hundredths] + '分';
        }
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
    
    // 更新加载中文本
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.textContent = t.processing;
    }
}

function hideLoading() {
    loading.style.display = 'none';
    convertBtn.disabled = false;
}

function createCopyButton(text) {
    const button = document.createElement('button');
    button.textContent = t.copy_btn;
    button.className = 'copy-btn';
    button.onclick = async () => {
        try {
            await navigator.clipboard.writeText(text);
            const originalText = button.textContent;
            button.textContent = t.copied;
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };
    return button;
}

function showResult(originalAmount, originalCurrency, convertedAmount, targetCurrency) {
    hideLoading();
    
    const convertedNum = parseFloat(convertedAmount);
    
    // 创建结果容器
    resultText.innerHTML = '';
    
    // 格式一：纯数字格式
    const numericFormatDiv = document.createElement('div');
    numericFormatDiv.className = 'result-format';
    const numericTitle = document.createElement('h4');
    numericTitle.textContent = t.format_numeric;
    const numericValue = document.createElement('p');
    numericValue.textContent = formatNumber(convertedNum, currentLang);
    const numericCopyBtn = createCopyButton(formatNumber(convertedNum, currentLang));
    
    numericFormatDiv.appendChild(numericTitle);
    numericFormatDiv.appendChild(numericValue);
    numericFormatDiv.appendChild(numericCopyBtn);
    resultText.appendChild(numericFormatDiv);
    
    // 格式二：带单位格式
    const unitFormatDiv = document.createElement('div');
    unitFormatDiv.className = 'result-format';
    const unitTitle = document.createElement('h4');
    unitTitle.textContent = t.format_with_units;
    const unitValue = document.createElement('p');
    unitValue.textContent = formatWithUnits(convertedNum, currentLang);
    const unitCopyBtn = createCopyButton(formatWithUnits(convertedNum, currentLang));
    
    unitFormatDiv.appendChild(unitTitle);
    unitFormatDiv.appendChild(unitValue);
    unitFormatDiv.appendChild(unitCopyBtn);
    resultText.appendChild(unitFormatDiv);
    
    // 如果是中文环境，显示额外格式
    if (currentLang === 'zh') {
        // 格式三：中文数字
        const chineseFormatDiv = document.createElement('div');
        chineseFormatDiv.className = 'result-format';
        const chineseTitle = document.createElement('h4');
        chineseTitle.textContent = t.format_chinese;
        const chineseValue = document.createElement('p');
        chineseValue.textContent = formatChineseNumerals(convertedNum);
        const chineseCopyBtn = createCopyButton(formatChineseNumerals(convertedNum));
        
        chineseFormatDiv.appendChild(chineseTitle);
        chineseFormatDiv.appendChild(chineseValue);
        chineseFormatDiv.appendChild(chineseCopyBtn);
        resultText.appendChild(chineseFormatDiv);
        
        // 格式四：大写中文
        const formalChineseFormatDiv = document.createElement('div');
        formalChineseFormatDiv.className = 'result-format';
        const formalChineseTitle = document.createElement('h4');
        formalChineseTitle.textContent = t.format_chinese_formal;
        const formalChineseValue = document.createElement('p');
        formalChineseValue.textContent = formatFormalChinese(convertedNum);
        const formalChineseCopyBtn = createCopyButton(formatFormalChinese(convertedNum));
        
        formalChineseFormatDiv.appendChild(formalChineseTitle);
        formalChineseFormatDiv.appendChild(formalChineseValue);
        formalChineseFormatDiv.appendChild(formalChineseCopyBtn);
        resultText.appendChild(formalChineseFormatDiv);
    }
    
    result.style.display = 'block';
}

function showError(message) {
    hideLoading();
    errorMessage.textContent = message;
    error.style.display = 'block';
}