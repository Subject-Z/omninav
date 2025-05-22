// 使用立即执行函数封装代码，避免全局污染
(function() {
    // 提前请求通知权限（优化为异步非阻塞方式）
    const requestNotificationPermission = () => {
        if (Notification.permission === 'default') {
            // 延迟请求以避免阻塞页面加载
            setTimeout(() => Notification.requestPermission(), 1000);
        }
    };
    requestNotificationPermission();

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
        
        // 从localStorage加载上次选择的间隔（添加错误处理）
        try {
            const savedInterval = localStorage.getItem('breakTimerInterval');
            if (savedInterval) {
                selectedMinutes = Math.max(1, parseInt(savedInterval) || 30); // 确保最小1分钟
            }
        } catch (e) {
            console.warn('Failed to read from localStorage', e);
        }
        
        timeLeft = selectedMinutes * 60;
        updateDisplay();
        
        // 设置按钮点击事件（使用事件委托优化）
        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains('time-btn')) return;
            
            selectedMinutes = parseInt(e.target.dataset.minutes);
            // 更新按钮状态和显示
            timeButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            timeLeft = selectedMinutes * 60;
            updateDisplay();
            
            // 保存选择（防抖处理）
            debouncedSaveInterval();
        });
        
        // 初始化选中状态
        timeButtons.forEach(button => {
            if (parseInt(button.dataset.minutes) === selectedMinutes) {
                button.classList.add('active');
            }
        });
        
        // 防抖函数用于保存间隔
        const debouncedSaveInterval = debounce(() => {
            try {
                localStorage.setItem('breakTimerInterval', selectedMinutes.toString());
            } catch (e) {
                console.warn('Failed to save to localStorage', e);
            }
        }, 500);
        
        // 格式化时间为MM:SS
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        }
        
        // 更新显示
        function updateDisplay() {
            timerDisplay.textContent = formatTime(timeLeft);
            // 添加低时间警告样式
            timerDisplay.classList.toggle('warning', timeLeft <= 60 && timeLeft > 0);
        }
        
        // 开始计时
        function startTimer() {
            if (isRunning) return;
            
            const interval = selectedMinutes * 60;
            timeLeft = interval;
            endTime = Date.now() + interval * 1000;
            isRunning = true;
            
            debouncedSaveInterval();
            
            // 使用requestAnimationFrame优化计时器
            function updateTimer() {
                timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
                updateDisplay();
                
                if (timeLeft <= 0) {
                    isRunning = false;
                    showNotification();
                    // 添加计时结束的视觉反馈
                    timerDisplay.classList.add('finished');
                    setTimeout(() => timerDisplay.classList.remove('finished'), 2000);
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
        
        // 显示通知（优化通知逻辑）
        function showNotification() {
            if (!('Notification' in window)) return;
            
            const show = () => {
                // 添加振动API支持
                if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
                
                new Notification('Break time!', {
                    body: 'Your break timer is up. Please take a rest!',
                    icon: '/images/break-reminder.webp',
                    requireInteraction: true
                });
            };
            
            if (Notification.permission === 'granted') {
                show();
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') show();
                });
            }
        }
        
        // 事件监听
        startBtn.addEventListener('click', startTimer);
        resetBtn.addEventListener('click', resetTimer);
        
        // 添加键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                if (isRunning) resetTimer(); else startTimer();
            }
        });
    });
    
    // 辅助函数
    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }
})();