// 立即检测并设置语言,避免闪烁
(function () {
	const lang = (navigator.language || navigator.userLanguage).startsWith('zh') ? 'zh' : 'en';
	const texts = {
		zh: {
			'page-title': 'OmniNav 工具',
			'page-subtitle': '便捷实用的网络工具集合，为您的日常使用提供帮助',
			'page-footer': '© OmniNav | ',
			'currency-tool': '货币转换',
			'currency-description': '快速汇率换算',
			'punctuation-tool': '标点转换',
			'punctuation-description': '中英标点互转工具',
			'vpn-tool': 'VPN 推荐',
			'vpn-description': '收集与比较常见 VPN 服务',
			'start-page-tool': '起始页',
			'start-page-description': '可定制的个人导航页面'
		},
		en: {
			'page-title': 'OmniNav Tools',
			'page-subtitle': 'A collection of convenient and practical web tools to assist your daily usage',
			'page-footer': '© OmniNav | ',
			'currency-tool': 'Currency Converter',
			'currency-description': 'Quick currency exchange calculator',
			'punctuation-tool': 'Punctuation Converter',
			'punctuation-description': 'Chinese-English punctuation conversion tool',
			'vpn-tool': 'VPN Recommendation',
			'vpn-description': 'Collection and comparison of common VPN services',
			'start-page-tool': 'Start Page',
			'start-page-description': 'Customizable personal navigation page'
		}
	};
	window.__OMNINAV_LANG__ = lang;
	window.__OMNINAV_TEXTS__ = texts[lang];
})();

// 应用语言设置(使用预加载的语言数据)
document.addEventListener('DOMContentLoaded', function () {
	const texts = window.__OMNINAV_TEXTS__;
	const currentYear = new Date().getFullYear();
	
	for (const key in texts) {
		const element = document.getElementById(key);
		if (element) {
			if (key === 'page-footer') {
				// 页脚特殊处理，包含年份信息
				element.textContent = texts[key] + currentYear;
			} else {
				element.textContent = texts[key];
			}
		}
	}
});