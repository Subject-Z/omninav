document.addEventListener('DOMContentLoaded', () => {
    const fortuneElement = document.getElementById('fortune');
    const generateBtn = document.getElementById('generateBtn');
    const loader = document.getElementById('loader');

    generateBtn.addEventListener('click', generateFortune);

    function generateFortune() {
        // Reset display
        fortuneElement.style.opacity = '0';
        fortuneElement.textContent = '';
        loader.style.display = 'block';
        generateBtn.disabled = true;

        // Get user inputs
        const browserLanguage = navigator.language || navigator.userLanguage;
        const category = document.querySelector('input[name="category"]:checked').value;
        const question = document.getElementById('userQuestion').value || 'Tell me my fortune';

        // First try the primary API
        tryPrimaryAPI(browserLanguage, category, question)
            .catch(error => {
                console.error('Primary API failed, trying fallback API:', error);
                return tryFallbackAPI(browserLanguage);
            })
            .then(quote => {
                // 简单markdown解析
                const formattedQuote = quote
                    .replace(/^\s*#\s*(.+)$/gm, '<h3>$1</h3>')  // 标题
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // 粗体
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')  // 斜体
                    .replace(/^\s*\*\s+(.+)$/gm, '<li>$1</li>')  // 无序列表
                    .replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>')  // 无序列表
                    .replace(/\n/g, '</p><p>')  // 换行转段落
                    .replace(/`(.+?)`/g, '<code>$1</code>')  // 代码
                    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">')  // 图片
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');  // 链接
                const wrappedQuote = `<div class="markdown-content">${formattedQuote}</div>`;
                fortuneElement.innerHTML = formattedQuote;
                fortuneElement.style.opacity = '1';
            })
            .catch(error => {
                console.error('Both APIs failed:', error);
                fortuneElement.innerHTML = '<p>Sorry, we are unable to provide a fortune at this time.</p><p>Please try again later or check your network connection.</p>';
                fortuneElement.style.opacity = '1';
            })
            .finally(() => {
                loader.style.display = 'none';
                generateBtn.disabled = false;
            });
    }

    function tryPrimaryAPI(language, category, question) {
        const apiKey = 'cpk_74191f496ed948bc9816e7cde682e193.44f99670f6c8587bbd6419fbdeb92a00.sHzMHuzSZunagZ0cv66MLhaxEkm2hXH6';
        const url = 'https://llm.chutes.ai/v1/chat/completions';

        const categoryMap = {
            'general': 'General Fortune',
            'love': 'Love & Relationship',
            'career': 'Career Development',
            'study': 'Education',
            'finance': 'Wealth',
            'health': 'Health'
        };

        const systemPrompt = {
            role: "system",
            content: `You are an expert in global fortune-telling traditions and practices. The current date and time is ${new Date().toLocaleString()}. Please provide a ${categoryMap[category]} prediction in ${language}. Keep the response concise, philosophical, and give direct advice without explanations.`
        };

        const userPrompt = {
            role: "user",
            content: question
        };

        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-ai/DeepSeek-V3-0324",
                messages: [systemPrompt, userPrompt]
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Primary API response not OK');
                }
                return response.json();
            })
            .then(data => {
                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    throw new Error('Invalid response format from primary API');
                }
                return data.choices[0].message.content;
            });
    }

    function tryFallbackAPI(language, category, question) {
        const apiKey = 'bf9e1a33a85657f93243ad7a7c2874e6.5vrkXHH0Tk2aRW3y';
        const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

        const systemPrompt = {
            role: "system",
            content: `You are an expert in global fortune-telling traditions and practices. The current date and time is ${new Date().toLocaleString()}. Please provide a prediction based on the user's selected category (${categoryMap[category]}) in ${language}. The response should be concise, philosophical, and directly offer guidance without explanations.`
        };

        const userPrompt = {
            role: "user",
            content: question
        };

        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "glm-4-flash",
                messages: [systemPrompt, userPrompt]
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fallback API response not OK');
                }
                return response.json();
            })
            .then(data => {
                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    throw new Error('Invalid response format from fallback API');
                }
                return data.choices[0].message.content;
            });
    }
});