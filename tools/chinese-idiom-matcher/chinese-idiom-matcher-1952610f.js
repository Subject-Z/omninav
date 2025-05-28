document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultContainer = document.getElementById('resultContainer');
    const idiomElement = document.getElementById('idiom');
    const pinyinElement = document.getElementById('pinyin');
    const translationElement = document.getElementById('translation');
    const explanationElement = document.getElementById('explanation');

    // API configuration
    const apiKey = 'cpk_74191f496ed948bc9816e7cde682e193.44f99670f6c8587bbd6419fbdeb92a00.sHzMHuzSZunagZ0cv66MLhaxEkm2hXH6';
    const url = 'https://llm.chutes.ai/v1/chat/completions';

    searchBtn.addEventListener('click', () => {
        const userText = userInput.value.trim();
        if (!userText) return;

        // Reset and show result container
        resultContainer.classList.remove('hidden');
        idiomElement.style.opacity = '0';
        pinyinElement.style.opacity = '0';
        translationElement.style.opacity = '0';
        explanationElement.style.opacity = '0';

        const systemPrompt = {
            role: "system",
            content: "You are an expert in Chinese idioms. Provide the most suitable idiom based on the user's input."
        };

        const userPrompt = {
            role: "user",
            content: `Based on this English context: "${userText}", please provide:
1. Idiom: The most suitable Chinese idiom (in Chinese characters)
2. Pinyin: The pinyin pronunciation (with tone marks)
3. Translation: The English translation
4. Explanation: A detailed explanation in English of when to use this idiom
5. No Markdown format.`
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
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const responseText = data.choices[0].message.content;
            console.log('API Response:', responseText);

            // Parse response
            let idiomMatch = responseText.match(/Idiom:\s*([^\n(]+)\s*(?:\(([^)]+)\))?/i);
            let pinyinMatch = responseText.match(/Pinyin:\s*(.*?)(\n|$)/i);
            let translationMatch = responseText.match(/Translation:\s*(.*?)(\n|$)/i);
            let explanationMatch = responseText.match(/Explanation:\s*([\s\S]*?)(?=\n(?:Idiom|Pinyin|Translation|Explanation)[:：]|$)/i);

            // Update DOM
            idiomElement.textContent = idiomMatch?.[1]?.trim() || 'No matching idiom found';
            pinyinElement.textContent = pinyinMatch?.[1]?.trim() || '';
            translationElement.textContent = translationMatch?.[1]?.trim() || '';
            explanationElement.textContent = explanationMatch?.[1]?.trim() || '';

            // Animate results
            setTimeout(() => {
                idiomElement.style.opacity = '1';
                pinyinElement.style.opacity = '1';
                translationElement.style.opacity = '1';
                explanationElement.style.opacity = '1';
            }, 100);
        })
        .catch(error => {
            console.error('Error:', error);
            idiomElement.textContent = 'Error fetching idiom';
            explanationElement.textContent = error.message;
            idiomElement.style.opacity = '1';
            explanationElement.style.opacity = '1';
        });
    });
});
