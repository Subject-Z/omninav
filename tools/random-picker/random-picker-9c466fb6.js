// 获取DOM元素
const itemInput = document.getElementById('item-input');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const historyList = document.getElementById('history-list');
const resultDiv = document.getElementById('result');

// 存储当前选项和历史记录
let items = [];
let historyRecords = JSON.parse(localStorage.getItem('randomPickerHistory')) || {};
let animationInterval;

// 加载历史记录到下拉菜单
function loadHistory() {
    historyList.innerHTML = '';
    Object.keys(historyRecords).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = historyRecords[key].name;
        historyList.appendChild(option);
    });
}

// 保存当前输入为历史记录
saveBtn.addEventListener('click', () => {
    const name = prompt('Please enter record name:');
    if (name && name.trim()) {
        const key = Date.now().toString();
        const inputItems = itemInput.value.trim();
        if (inputItems) {
            historyRecords[key] = {
                name: name,
                items: inputItems.split('\n').filter(item => item)
            };
            localStorage.setItem('randomPickerHistory', JSON.stringify(historyRecords));
            loadHistory();
            alert('Record saved successfully!');
        } else {
            alert('Please enter some items first!');
        }
    } else {
        alert('Record name cannot be empty!');
    }
});

// 删除选中的历史记录
deleteBtn.addEventListener('click', () => {
    const selectedKey = historyList.value;
    if (selectedKey) {
        delete historyRecords[selectedKey];
        localStorage.setItem('randomPickerHistory', JSON.stringify(historyRecords));
        loadHistory();
    }
});

// 加载选中的历史记录
historyList.addEventListener('change', () => {
    const selectedKey = historyList.value;
    if (selectedKey) {
        itemInput.value = historyRecords[selectedKey].items.join('\n');
    }
});

// 开始随机选择
startBtn.addEventListener('click', () => {
    items = itemInput.value.trim().split('\n').filter(item => item);
    if (items.length === 0) {
        alert('Please enter at least one option');
        return;
    }
    
    // 禁用按钮
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resultDiv.textContent = '';
    
    // 快速轮播逻辑
    function fastAnimation() {
        resultDiv.textContent = items[Math.floor(Math.random() * items.length)];
    }
    
    // 每50ms切换一次选项
    animationInterval = setInterval(fastAnimation, 50);
});

// 停止选择
stopBtn.addEventListener('click', () => {
    clearInterval(animationInterval);
    startBtn.disabled = false;
    stopBtn.disabled = true;
    
    // 显示最终结果
    if (items.length > 0) {
        const finalResult = items[Math.floor(Math.random() * items.length)];
        resultDiv.textContent = finalResult;
        resultDiv.classList.add('final-result');
    }
});

// 初始化加载历史记录
loadHistory();