document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const itemsInput = document.getElementById('items-input');
    const sortRadios = document.querySelectorAll('input[name="sort"]');
    const saveBtn = document.getElementById('save-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const recordsList = document.getElementById('saved-records-list');
    
    let items = [];
    let rotation = 0;
    let targetRotation = 0;
    let spinning = false;
    let animationId = null;
    
    // 初始化轮盘
    updateWheel();
    
    // 输入变化时更新轮盘
    itemsInput.addEventListener('input', updateWheel);
    
    // 排序选项变化时更新轮盘
    sortRadios.forEach(radio => {
        radio.addEventListener('change', updateWheel);
    });
    
    // 旋转按钮点击事件 - 现在点击轮盘本身旋转
    canvas.addEventListener('click', spin);
    
    // 更新轮盘显示
    function updateWheel() {
        items = itemsInput.value.split('\n').filter(item => item.trim() !== '');
        
        // 至少需要2个选项
        canvas.style.transform = 'rotate(0deg)';
        // 指针始终显示
        document.querySelector('.pointer').style.display = 'block';
        
        // 应用排序
        const sortValue = document.querySelector('input[name="sort"]:checked').value;
        if (sortValue === 'asc') {
            items.sort();
        } else if (sortValue === 'desc') {
            items.sort().reverse();
        } else if (sortValue === 'random') {
            shuffleArray(items);
        }
        
        // 重新绘制轮盘
        drawWheel();
    }
    
    // 绘制轮盘
    function drawWheel() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        
        const anglePerItem = (2 * Math.PI) / items.length;
        
        items.forEach((item, index) => {
            const startAngle = index * anglePerItem;
            const endAngle = (index + 1) * anglePerItem;
            
            // 绘制扇形
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            // 使用HSL颜色空间均匀分配颜色
            const hue = (index * 360) / items.length;
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.fill();
            ctx.stroke();
            
            // 绘制文本
            ctx.save();
            ctx.translate(centerX, centerY);
            const textAngle = startAngle + anglePerItem / 2;
            ctx.rotate(textAngle);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(item, radius - 20, 5);
            ctx.restore();
        });
    }
    
    // 开始旋转
    function spin() {
        if (spinning || items.length < 2) return;
        
        spinning = true;
        
        // 随机设置目标旋转圈数（5-10圈）加上随机角度
        targetRotation = rotation + 5 * 360 + Math.random() * 5 * 360;
        
        // 开始动画
        animate();
    }
    
    // 动画循环
    function animate() {
        // 缓动效果：越接近目标速度越慢
        const diff = targetRotation - rotation;
        rotation += diff * 0.05;
        
        // 更新canvas旋转
        canvas.style.transform = `rotate(${rotation}deg)`;
        
        if (Math.abs(diff) > 0.5) {
            animationId = requestAnimationFrame(animate);
        } else {
            // 动画结束
            spinning = false;
        }
    }
    
    
    // 随机打乱数组
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // 窗口大小变化时重新绘制
    window.addEventListener('resize', () => {
        drawWheel();
    });
    
    // 保存记录
    saveBtn.addEventListener('click', () => {
        if (items.length < 2) return;
        
        const recordName = prompt('Enter a name for this record:');
        if (!recordName) return;
        
        const record = {
            name: recordName,
            items: [...items],
            timestamp: new Date().toISOString()
        };
        
        let records = JSON.parse(localStorage.getItem('randomWheelRecords') || '[]');
        records.push(record);
        localStorage.setItem('randomWheelRecords', JSON.stringify(records));
        
        updateRecordsList();
    });
    
    // 删除记录
    deleteBtn.addEventListener('click', () => {
        if (recordsList.selectedIndex === -1) return;
        
        let records = JSON.parse(localStorage.getItem('randomWheelRecords') || '[]');
        records.splice(recordsList.selectedIndex, 1);
        localStorage.setItem('randomWheelRecords', JSON.stringify(records));
        
        updateRecordsList();
    });
    
    // 加载记录
    recordsList.addEventListener('dblclick', () => {
        if (recordsList.selectedIndex === -1) return;
        
        const records = JSON.parse(localStorage.getItem('randomWheelRecords') || '[]');
        const record = records[recordsList.selectedIndex];
        itemsInput.value = record.items.join('\n');
        updateWheel();
    });
    
    // 更新记录列表
    function updateRecordsList() {
        recordsList.innerHTML = '';
        const records = JSON.parse(localStorage.getItem('randomWheelRecords') || '[]');
        records.forEach(record => {
            const option = document.createElement('option');
            option.textContent = `${record.name} (${record.items.length} items)`;
            recordsList.appendChild(option);
        });
    }
    
    // 初始化记录列表
    updateRecordsList();
});