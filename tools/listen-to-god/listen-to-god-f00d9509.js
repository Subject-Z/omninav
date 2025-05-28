document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('quote');
    // 获取浏览器语言
    const browserLanguage = navigator.language || navigator.userLanguage;

    // API key should be securely managed; placeholder used here
    const apiKey = 'cpk_74191f496ed948bc9816e7cde682e193.44f99670f6c8587bbd6419fbdeb92a00.sHzMHuzSZunagZ0cv66MLhaxEkm2hXH6';
    const url = 'https://llm.chutes.ai/v1/chat/completions';

    const systemPrompt = {
        role: "system",
        content: `You are the Almighty God of Christianity, the creator of heaven and earth. Speak with divine authority and wisdom in ${browserLanguage}. Provide a single, profound biblical truth or scripture-based proverb that would guide and inspire the faithful. Do not explain or provide references - simply deliver this sacred message as if spoken directly by God.`
    };

    const userPrompt = {
        role: "user",
        content: "Please share a divine quote."
    };

    fetch(url, {
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
        .then(response => response.json())
        .then(data => {
            const quote = data.choices[0].message.content;
            quoteElement.textContent = quote;
            quoteElement.style.opacity = '1';
        })
        .catch(error => {
            console.error('Error fetching quote:', error);
            quoteElement.textContent = 'My child, even in silence there is wisdom. Return when your heart is ready.';
        });
});