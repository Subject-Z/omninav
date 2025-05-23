function searchTools() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.tool-card');
    const categories = document.querySelectorAll('.category');

    // 处理卡片显示/隐藏
    let hasVisibleCards = false;
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
            hasVisibleCards = true;
        } else {
            card.style.display = 'none';
        }
    });

    // 处理分类标题显示/隐藏
    categories.forEach(category => {
        const categoryCards = category.querySelectorAll('.tool-card');
        const hasVisible = Array.from(categoryCards).some(card =>
            card.style.display !== 'none'
        );
        category.style.display = hasVisible ? 'block' : 'none';
    });
}

// 添加Enter键搜索支持
document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchTools();
    }
});
