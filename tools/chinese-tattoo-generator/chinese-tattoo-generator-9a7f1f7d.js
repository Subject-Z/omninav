document.addEventListener('DOMContentLoaded', () => {
    const englishInput = document.getElementById('englishInput');
    const submitBtn = document.getElementById('submitBtn');
    const result = document.getElementById('result');

    // API key (placeholder; should be securely managed)
    const apiKey = 'cpk_74191f496ed948bc9816e7cde682e193.44f99670f6c8587bbd6419fbdeb92a00.sHzMHuzSZunagZ0cv66MLhaxEkm2hXH6';
    const url = 'https://llm.chutes.ai/v1/chat/completions';

    submitBtn.addEventListener('click', () => {
        const inputText = englishInput.value.trim();
        const outputType = document.querySelector('input[name="chineseType"]:checked').value;

        if (!inputText) {
            result.textContent = 'Please enter a meaning.';
            result.style.opacity = '1';
            return;
        }

        // Construct system prompt based on Chinese type
        const systemPrompt = {
            role: "system", 
            content: `You are a professional Chinese language expert specializing in creative translations for tattoos.
            Based on the user's input meaning, provide the SINGLE BEST ${outputType === 'simplified' ? 'Simplified Chinese' : 'Traditional Chinese'} translation.
            
            The translation should be:
            - Short, idomatic, and poetic is better
            - Artistically suitable for tattoos
            - Culturally appropriate`
        };

        const userPrompt = {
            role: "user",
            content: inputText
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
                const translation = data.choices[0].message.content.split('\n')[0]; // Take only the first line
                const tattooText = document.getElementById('tattooText');
                const copyBtn = document.getElementById('copyBtn');
                
                tattooText.textContent = translation;
                copyBtn.classList.remove('hidden');
                
                result.classList.add('result-show');
                
                // Add copy functionality
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(translation)
                        .then(() => {
                            copyBtn.textContent = 'Copied!';
                            setTimeout(() => {
                                copyBtn.textContent = 'Copy to Clipboard';
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy: ', err);
                        });
                });
            })
            .catch(error => {
                console.error('Error fetching translation:', error);
                result.textContent = 'Error generating translation. Please try again.';
                result.style.opacity = '1';
            });
    });
});