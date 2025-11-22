// 默认数据
const defaultData = [
  { id: 1, name: 'Google', url: 'https://www.google.com', icon: 'https://www.google.com/favicon.ico' },
  { id: 2, name: '百度', url: 'https://www.baidu.com', icon: 'https://www.baidu.com/favicon.ico' },
  { id: 3, name: 'Bilibili', url: 'https://www.bilibili.com', icon: 'https://www.bilibili.com/favicon.ico' },
  { id: 4, name: 'GitHub', url: 'https://github.com', icon: 'https://github.com/favicon.ico' }
];

// Bing壁纸API配置
const BING_API_URL = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1';
const BING_BASE_URL = 'https://www.bing.com/';

const WALLPAPER_CACHE_KEY = 'bingWallpaperCache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时毫秒
let navData = [];
let currentEditIndex = -1; // -1 表示新增模式，其他值为编辑模式的索引

// 获取Bing每日壁纸
async function fetchBingWallpaper() {
  // 检查缓存
  const cacheStr = localStorage.getItem(WALLPAPER_CACHE_KEY);
  if (cacheStr) {
    try {
      const cache = JSON.parse(cacheStr);
      if (Date.now() - cache.timestamp < CACHE_DURATION) {
        console.log('使用缓存的壁纸');
        return cache.url;
      }
    } catch (e) {
      console.warn('缓存解析失败:', e);
    }
  }
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(BING_API_URL)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      console.warn(`Bing API响应状态异常: ${response.status}`);
      return getFallbackWallpaper();
    }
    
    const data = await response.json();
    
    if (data.images && data.images.length > 0) {
      const imageUrl = BING_BASE_URL + data.images[0].url;
      localStorage.setItem(WALLPAPER_CACHE_KEY, JSON.stringify({
        url: imageUrl,
        timestamp: Date.now()
      }));
      return imageUrl;
    } else {
      console.warn('Bing API返回数据格式不符合预期');
      return getFallbackWallpaper();
    }
  } catch (error) {
    console.warn('获取Bing壁纸失败，使用备选:', error.message);
    return getFallbackWallpaper();
  }
}

// 获取备选壁纸
function getFallbackWallpaper() {
  // 使用公共的、可靠的随机风景图片服务
  // 这些服务通常允许跨域请求且不需要API key
  const fallbackOptions = [
    'https://source.unsplash.com/random/1920x1080?nature',
    'https://picsum.photos/1920/1080?nature',
    'https://source.unsplash.com/random/1920x1080?landscape'
  ];
  
  // 随机选择一个备选壁纸
  const randomIndex = Math.floor(Math.random() * fallbackOptions.length);
  return fallbackOptions[randomIndex];
}

// 设置背景
function setBackground(imageUrl = null, useBingWallpaper = false) {
  const body = document.body;
  // 获取CSS变量值
  const rootStyles = getComputedStyle(document.documentElement);
  const textColor = rootStyles.getPropertyValue('--text-color').trim() || '#333';
  
  if (useBingWallpaper && imageUrl) {
    body.style.backgroundImage = `url('${imageUrl}')`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed';
    body.classList.add('wallpaper-enabled');
    // 确保文字在深色背景上清晰可见
    document.querySelectorAll('.nav-title').forEach(title => {
      title.style.color = 'white';
      title.style.textShadow = '0 1px 3px rgba(0,0,0,0.8)';
    });
  } else {
    body.style.backgroundImage = 'none';
    body.style.backgroundColor = '#FFFFFF';
    body.classList.remove('wallpaper-enabled');
    document.querySelectorAll('.nav-title').forEach(title => {
      title.style.color = textColor;
      title.style.textShadow = 'none';
    });
  }
}

// 切换Bing壁纸设置
function toggleBingWallpaper(checkbox) {
  const useBingWallpaper = checkbox.checked;
  
  // 保存设置到localStorage
  localStorage.setItem('useBingWallpaper', useBingWallpaper);
  
  // 应用设置
  if (useBingWallpaper) {
    fetchBingWallpaper().then(imageUrl => {
      if (imageUrl) {
        setBackground(imageUrl, true);
      }
    });
  } else {
    setBackground(null, false);
  }
}

// 初始化
window.onload = function() {
  setBackground(null, false);
  // 加载保存的数据
  const saved = localStorage.getItem('myNavData');
  if (saved) {
    navData = JSON.parse(saved);
  } else {
    navData = defaultData;
  }
  
  // 加载Bing壁纸设置
  const useBingWallpaper = localStorage.getItem('useBingWallpaper') === 'true';
  const bingToggle = document.getElementById('bingWallpaperToggle');
  if (bingToggle) {
    bingToggle.checked = useBingWallpaper;
  }
  
  if (useBingWallpaper) {
    fetchBingWallpaper().then(imageUrl => {
      if (imageUrl) {
        setBackground(imageUrl, true);
      } else {
        setBackground(null, false);
      }
    });
  }
  
  renderGrid();
};

// 渲染网格
function renderGrid() {
  const container = document.getElementById('gridContainer');
  container.innerHTML = '';

  navData.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'nav-item';
    
    // 点击卡片跳转
    div.onclick = (e) => {
      // 如果点击的是编辑按钮，不跳转
      if(e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) return;
      window.open(item.url, '_blank');
    };

    // 图标错误处理（显示默认图）
    const iconSrc = item.icon || 'https://via.placeholder.com/60?text=Icon';

    div.innerHTML = `
      <div class="edit-btn" onclick="openModal(${index})">✏️</div>
      <img src="${iconSrc}" class="nav-icon" onerror="this.src='https://via.placeholder.com/60?text=Error'">
      <div class="nav-title">${item.name}</div>
    `;
    container.appendChild(div);
  });

  // 添加最后的“+”号按钮
  const addBtn = document.createElement('div');
  addBtn.className = 'nav-item add-item';
  addBtn.onclick = () => openModal(-1);
  addBtn.innerHTML = `
    <div class="add-icon">+</div>
    <div class="nav-title">添加</div>
  `;
  container.appendChild(addBtn);
}

// 打开弹窗
function openModal(index) {
  currentEditIndex = index;
  const modal = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const btnDelete = document.getElementById('btnDelete');

  const nameInput = document.getElementById('inputName');
  const urlInput = document.getElementById('inputUrl');
  const iconInput = document.getElementById('inputIcon');

  if (index === -1) {
    // 新增模式
    title.innerText = "添加新网站";
    btnDelete.style.display = 'none';
    nameInput.value = '';
    urlInput.value = '';
    iconInput.value = '';
  } else {
    // 编辑模式
    title.innerText = "编辑快捷方式";
    btnDelete.style.display = 'block';
    const item = navData[index];
    nameInput.value = item.name;
    urlInput.value = item.url;
    iconInput.value = item.icon;
  }

  modal.style.display = 'flex';
}

// 关闭弹窗
function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

// 保存数据（新增或修改）
function saveItem() {
  const name = document.getElementById('inputName').value;
  let url = document.getElementById('inputUrl').value;
  const icon = document.getElementById('inputIcon').value;

  if (!name || !url) {
    alert("名称和链接地址不能为空！");
    return;
  }

  // 简单的URL补全
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  const newItem = {
    id: Date.now(), // 简单的唯一ID
    name: name,
    url: url,
    icon: icon || `https://www.google.com/s2/favicons?domain=${url}&sz=64` // 尝试自动获取图标
  };

  if (currentEditIndex === -1) {
    navData.push(newItem);
  } else {
    navData[currentEditIndex] = newItem;
  }

  saveToLocal();
  renderGrid();
  closeModal();
}

// 删除当前项
function deleteCurrentItem() {
  if (currentEditIndex > -1) {
    navData.splice(currentEditIndex, 1);
    saveToLocal();
    renderGrid();
    closeModal();
  }
}

// 保存到 LocalStorage
function saveToLocal() {
  localStorage.setItem('myNavData', JSON.stringify(navData));
}

// 导出数据
function exportData() {
  const dataStr = JSON.stringify(navData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "nav-data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 触发导入
function triggerImport() {
  document.getElementById('fileInput').click();
}

// 导入数据
function importData(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const json = JSON.parse(e.target.result);
      if (Array.isArray(json)) {
        if(confirm('导入将覆盖现有数据，确定继续吗？')) {
          navData = json;
          saveToLocal();
          renderGrid();
          alert('导入成功！');
        }
      } else {
        alert('文件格式不正确！');
      }
    } catch (err) {
      alert('JSON 解析失败，请检查文件内容。');
    }
    // 清空input，以便重复导入同一文件
    input.value = '';
  };
  reader.readAsText(file);
}

// 点击遮罩层关闭弹窗
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});


// 切换设置面板
function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  if (panel) {
    panel.classList.toggle('open');
  }
}
// 点击页面其他区域关闭侧边栏
document.addEventListener('click', function(event) {
  const settingsPanel = document.getElementById('settingsPanel');
  const settingsToggle = document.querySelector('.settings-toggle');
  
  // 检查侧边栏是否打开
  if (settingsPanel && settingsPanel.classList.contains('open')) {
    // 检查点击目标是否在侧边栏内或点击了设置按钮
    const isClickInsidePanel = settingsPanel.contains(event.target);
    const isClickOnToggle = settingsToggle && settingsToggle.contains(event.target);
    
    // 如果点击既不在侧边栏内，也不是设置按钮，则关闭侧边栏
    if (!isClickInsidePanel && !isClickOnToggle) {
      settingsPanel.classList.remove('open');
    }
  }
});
