// 提前请求通知权限
if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timeButtons = document.querySelectorAll('.time-btn');
    
    let timer;
    let timeLeft = 0;
    let endTime;
    let isRunning = false;
    let selectedMinutes = 30;
    
    // 从localStorage加载上次选择的间隔
    const savedInterval = localStorage.getItem('breakTimerInterval');
    if (savedInterval) {
        selectedMinutes = parseInt(savedInterval);
    }
    timeLeft = selectedMinutes * 60;
    updateDisplay();
    
    // 设置按钮点击事件
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedMinutes = parseInt(button.dataset.minutes);
            // 更新按钮状态和显示
            timeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            timeLeft = selectedMinutes * 60;
            updateDisplay();
        });
        
        // 初始化选中状态
        if (parseInt(button.dataset.minutes) === selectedMinutes) {
            button.classList.add('active');
        }
    });
    
    // 格式化时间为MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    
    // 更新显示
    function updateDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
    }
    
    // 开始计时
    function startTimer() {
        if (isRunning) return;
        
        const interval = selectedMinutes * 60;
        timeLeft = interval;
        endTime = Date.now() + interval * 1000;
        isRunning = true;
        
        // 使用requestIdleCallback优化localStorage操作
        requestIdleCallback(() => {
            localStorage.setItem('breakTimerInterval', selectedMinutes.toString());
        });
        
        // 使用requestAnimationFrame优化计时器
        function updateTimer() {
            timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            updateDisplay();
            
            if (timeLeft <= 0) {
                isRunning = false;
                showNotification();
            } else if (isRunning) {
                requestAnimationFrame(updateTimer);
            }
        }
        
        updateTimer();
    }
    
    // 重置计时器
    function resetTimer() {
        isRunning = false;
        timeLeft = selectedMinutes * 60;
        endTime = 0;
        updateDisplay();
    }
    
    // 显示通知
    function showNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Break time!', {
                body: 'Your break timer is up. Please take a rest!',
                icon: 'https://cdn-icons-png.flaticon.com/512/1/1753.png'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification();
                }
            });
        }
    }
    
    // 页面关闭确认
    window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave?';
    });
    
    // 事件监听
    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);
});