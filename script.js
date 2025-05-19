// 显示当前日期
const today = new Date();
document.getElementById('current-date').textContent = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
});

// 定义各营养素的数据结构
const nutrients = [
    {
        name: '碳水',
        targetId: 'carb-target',
        mealIds: {
            breakfast: 'carb-breakfast',
            lunch: 'carb-lunch',
            dinner: 'carb-dinner'
        },
        color: '#4CAF50',
        chartId: 'carb-chart',
        historyChartId: 'carb-history-chart',
        unit: 'g'
    },
    {
        name: '蛋白质',
        targetId: 'protein-target',
        mealIds: {
            breakfast: 'protein-breakfast',
            lunch: 'protein-lunch',
            dinner: 'protein-dinner'
        },
        color: '#2196F3',
        chartId: 'protein-chart',
        historyChartId: 'protein-history-chart',
        unit: 'g'
    },
    {
        name: '脂肪',
        targetId: 'fat-target',
        mealIds: {
            breakfast: 'fat-breakfast',
            lunch: 'fat-lunch',
            dinner: 'fat-dinner'
        },
        color: '#F44336',
        chartId: 'fat-chart',
        historyChartId: 'fat-history-chart',
        unit: 'g'
    },
    {
        name: '水分',
        targetId: 'water-target',
        mealIds: {
            breakfast: 'water-breakfast',
            lunch: 'water-lunch',
            dinner: 'water-dinner'
        },
        color: '#009688',
        chartId: 'water-chart',
        historyChartId: 'water-history-chart',
        unit: 'ml'
    }
];

// 创建今日图表
const charts = nutrients.map(n => {
    return new Chart(document.getElementById(n.chartId), {
        type: 'bar',
        data: {
            labels: ['总摄入量'],
            datasets: [
                {
                    label: '目标摄入量',
                    data: [],
                    backgroundColor: `${n.color}80`,
                    borderColor: `${n.color}`,
                    borderWidth: 1,
                    borderRadius: 8,
                    barPercentage: 0.5,
                },
                {
                    label: '早餐',
                    data: [],
                    backgroundColor: `${n.color}`,
                    borderWidth: 0,
                    borderRadius: 8,
                    barPercentage: 0.5,
                    stack: 'meals'
                },
                {
                    label: '午餐',
                    data: [],
                    backgroundColor: `${n.color}CC`,
                    borderWidth: 0,
                    borderRadius: 8,
                    barPercentage: 0.5,
                    stack: 'meals'
                },
                {
                    label: '晚餐',
                    data: [],
                    backgroundColor: `${n.color}99`,
                    borderWidth: 0,
                    borderRadius: 8,
                    barPercentage: 0.5,
                    stack: 'meals'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: '#f0f0f0' },
                    ticks: { color: '#666' },
                    stacked: true
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        color: '#444',
                        font: { weight: 'bold' },
                        callback: function(value, index) {
                            return ['总摄入量'][index] || '';
                        }
                    },
                    stacked: true
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.x;
                            return `${label}: ${value} ${n.unit}`;
                        }
                    }
                }
            }
        }
    });
});

// 创建历史数据图表
const historyCharts = nutrients.map(n => {
    return new Chart(document.getElementById(n.historyChartId), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '目标值',
                    data: [],
                    borderColor: `${n.color}80`,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: `${n.color}80`,
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: '早餐',
                    data: [],
                    borderColor: n.color,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointBackgroundColor: n.color,
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: '午餐',
                    data: [],
                    borderColor: `${n.color}CC`,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointBackgroundColor: `${n.color}CC`,
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: '晚餐',
                    data: [],
                    borderColor: `${n.color}99`,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointBackgroundColor: `${n.color}99`,
                    pointRadius: 4,
                    tension: 0.1
                },
                {
                    label: '总摄入',
                    data: [],
                    borderColor: `#673ab7`,
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    pointBackgroundColor: `#673ab7`,
                    pointRadius: 4,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f0f0f0' },
                    ticks: { color: '#666' },
                    title: {
                        display: true,
                        text: n.name + ' (' + n.unit + ')'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#666' }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value} ${n.unit}`;
                        }
                    }
                }
            }
        }
    });
});

// 更新今日图表函数
function updateCharts() {
    nutrients.forEach((n, index) => {
        const target = parseFloat(document.getElementById(n.targetId).value) || 0;
        const breakfast = parseFloat(document.getElementById(n.mealIds.breakfast).value) || 0;
        const lunch = parseFloat(document.getElementById(n.mealIds.lunch).value) || 0;
        const dinner = parseFloat(document.getElementById(n.mealIds.dinner).value) || 0;
        
        // 更新图表数据
        charts[index].data.datasets[0].data = [target];
        charts[index].data.datasets[1].data = [breakfast];
        charts[index].data.datasets[2].data = [lunch];
        charts[index].data.datasets[3].data = [dinner];
        
        // 更新图表
        charts[index].update();
    });
}

// 设置按钮状态
function setButtonsState(disabled) {
    document.getElementById('play-all').disabled = disabled;
    document.getElementById('play-breakfast').disabled = disabled;
    document.getElementById('play-lunch').disabled = disabled;
    document.getElementById('play-dinner').disabled = disabled;
}

// 重置图表到特定状态函数
function resetCharts(keepBreakfast = false, keepLunch = false, keepDinner = false) {
    // 获取所有输入的数值
    const nutrientValues = nutrients.map((n, index) => {
        return {
            breakfast: parseFloat(document.getElementById(n.mealIds.breakfast).value) || 0,
            lunch: parseFloat(document.getElementById(n.mealIds.lunch).value) || 0,
            dinner: parseFloat(document.getElementById(n.mealIds.dinner).value) || 0,
            target: parseFloat(document.getElementById(n.targetId).value) || 0
        };
    });
    
    // 根据参数重置图表
    nutrients.forEach((n, index) => {
        charts[index].data.datasets[0].data = [nutrientValues[index].target];
        charts[index].data.datasets[1].data = [keepBreakfast ? nutrientValues[index].breakfast : 0]; 
        charts[index].data.datasets[2].data = [keepLunch ? nutrientValues[index].lunch : 0]; 
        charts[index].data.datasets[3].data = [keepDinner ? nutrientValues[index].dinner : 0]; 
        charts[index].update();
    });
}

// 创建单个餐饮动画函数
function animateMeal(mealIndex, onComplete) {
    // 获取当前餐饮对应的数值
    const nutrientValues = nutrients.map((n, index) => {
        return {
            breakfast: parseFloat(document.getElementById(n.mealIds.breakfast).value) || 0,
            lunch: parseFloat(document.getElementById(n.mealIds.lunch).value) || 0,
            dinner: parseFloat(document.getElementById(n.mealIds.dinner).value) || 0,
        };
    });
    
    const totalFrames = 60;
    let currentFrame = 0;
    
    // 基于mealIndex确定要动画的餐饮 (1=早餐, 2=午餐, 3=晚餐)
    const mealType = mealIndex === 1 ? 'breakfast' : mealIndex === 2 ? 'lunch' : 'dinner';
    
    const animate = () => {
        if (currentFrame <= totalFrames) {
            const progress = currentFrame / totalFrames;
            
            nutrients.forEach((n, index) => {
                // 更新相应的数据集
                charts[index].data.datasets[mealIndex].data = [nutrientValues[index][mealType] * progress];
                charts[index].update();
            });
            
            currentFrame++;
            requestAnimationFrame(animate);
        } else {
            // 动画完成
            if (onComplete) onComplete();
        }
    };
    
    animate();
}

// 早餐动画播放函数
function playBreakfastAnimation() {
    setButtonsState(true);
    document.getElementById('play-breakfast').innerHTML = '<i class="fas fa-spinner fa-spin"></i> 播放中...';
    
    // 重置图表，保持午餐和晚餐不变
    resetCharts(false, true, true);
    
    // 播放早餐动画
    animateMeal(1, () => {
        setButtonsState(false);
        document.getElementById('play-breakfast').innerHTML = '<i class="fas fa-mug-hot"></i> 早餐播放';
    });
}

// 午餐动画播放函数
function playLunchAnimation() {
    setButtonsState(true);
    document.getElementById('play-lunch').innerHTML = '<i class="fas fa-spinner fa-spin"></i> 播放中...';
    
    // 重置图表，保持早餐和晚餐不变
    resetCharts(true, false, true);
    
    // 播放午餐动画
    animateMeal(2, () => {
        setButtonsState(false);
        document.getElementById('play-lunch').innerHTML = '<i class="fas fa-utensils"></i> 午餐播放';
    });
}

// 晚餐动画播放函数
function playDinnerAnimation() {
    setButtonsState(true);
    document.getElementById('play-dinner').innerHTML = '<i class="fas fa-spinner fa-spin"></i> 播放中...';
    
    // 重置图表，保持早餐和午餐不变
    resetCharts(true, true, false);
    
    // 播放晚餐动画
    animateMeal(3, () => {
        setButtonsState(false);
        document.getElementById('play-dinner').innerHTML = '<i class="fas fa-moon"></i> 晚餐播放';
    });
}

// 全部动画播放函数
function playAllAnimation() {
    setButtonsState(true);
    document.getElementById('play-all').innerHTML = '<i class="fas fa-spinner fa-spin"></i> 播放中...';
    
    // 重置所有图表
    resetCharts(false, false, false);
    
    // 播放早餐动画，然后午餐，然后晚餐
    animateMeal(1, () => {
        // 早餐结束，播放午餐
        animateMeal(2, () => {
            // 午餐结束，播放晚餐
            animateMeal(3, () => {
                // 所有动画结束
                setButtonsState(false);
                document.getElementById('play-all').innerHTML = '<i class="fas fa-play"></i> 全部播放';
            });
        });
    });
}

// 本地存储功能 
// 检查是否有保存的数据
function checkAndLoadTodayData() {
    const dateString = new Date().toISOString().split('T')[0]; // 2023-05-25 格式
    const todayData = localStorage.getItem(`nutrition-data-${dateString}`);
    
    if (todayData) {
        const data = JSON.parse(todayData);
        
        // 填充表单数据
        nutrients.forEach(n => {
            if (data[n.name]) {
                document.getElementById(n.targetId).value = data[n.name].target || 0;
                document.getElementById(n.mealIds.breakfast).value = data[n.name].breakfast || 0;
                document.getElementById(n.mealIds.lunch).value = data[n.name].lunch || 0;
                document.getElementById(n.mealIds.dinner).value = data[n.name].dinner || 0;
            }
        });
        
        // 更新图表
        updateCharts();
    }
}

// 保存今日数据
function saveNutritionData() {
    const button = document.getElementById('save-data');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
    button.disabled = true;
    
    const dateString = new Date().toISOString().split('T')[0]; // 2023-05-25 格式
    
    // 准备数据对象
    const data = {};
    
    nutrients.forEach(n => {
        data[n.name] = {
            target: parseFloat(document.getElementById(n.targetId).value) || 0,
            breakfast: parseFloat(document.getElementById(n.mealIds.breakfast).value) || 0,
            lunch: parseFloat(document.getElementById(n.mealIds.lunch).value) || 0,
            dinner: parseFloat(document.getElementById(n.mealIds.dinner).value) || 0
        };
    });
    
    // 保存到localStorage
    localStorage.setItem(`nutrition-data-${dateString}`, JSON.stringify(data));
    
    // 模拟保存延迟，给用户反馈
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> 已保存';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-save"></i> 保存今日数据';
            button.disabled = false;
            
            // 重新加载历史数据
            loadHistoryData();
        }, 1000);
    }, 1000);
}

// 加载历史数据
function loadHistoryData(days = 7) {
    const today = new Date();
    const dates = [];
    const historyData = {};
    
    // 初始化所有营养素的历史数据结构
    nutrients.forEach(n => {
        historyData[n.name] = {
            targets: [],
            breakfast: [],
            lunch: [],
            dinner: [],
            total: []
        };
    });
    
    // 收集指定天数的历史数据
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        // 添加日期标签（只保留月和日）
        dates.push(date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }));
        
        // 尝试获取该日期的数据
        const dayData = localStorage.getItem(`nutrition-data-${dateString}`);
        
        if (dayData) {
            const data = JSON.parse(dayData);
            
            // 添加每种营养素的数据
            nutrients.forEach(n => {
                if (data[n.name]) {
                    historyData[n.name].targets.push(data[n.name].target);
                    historyData[n.name].breakfast.push(data[n.name].breakfast);
                    historyData[n.name].lunch.push(data[n.name].lunch);
                    historyData[n.name].dinner.push(data[n.name].dinner);
                    historyData[n.name].total.push(
                        data[n.name].breakfast + data[n.name].lunch + data[n.name].dinner
                    );
                } else {
                    // 如果没有数据则填充0
                    historyData[n.name].targets.push(0);
                    historyData[n.name].breakfast.push(0);
                    historyData[n.name].lunch.push(0);
                    historyData[n.name].dinner.push(0);
                    historyData[n.name].total.push(0);
                }
            });
        } else {
            // 如果没有数据则填充0
            nutrients.forEach(n => {
                historyData[n.name].targets.push(0);
                historyData[n.name].breakfast.push(0);
                historyData[n.name].lunch.push(0);
                historyData[n.name].dinner.push(0);
                historyData[n.name].total.push(0);
            });
        }
    }
    
    // 更新历史图表
    nutrients.forEach((n, index) => {
        const chart = historyCharts[index];
        
        chart.data.labels = dates;
        chart.data.datasets[0].data = historyData[n.name].targets;
        chart.data.datasets[1].data = historyData[n.name].breakfast;
        chart.data.datasets[2].data = historyData[n.name].lunch;
        chart.data.datasets[3].data = historyData[n.name].dinner;
        chart.data.datasets[4].data = historyData[n.name].total;
        
        chart.update();
    });
}

// Tab切换
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活跃状态
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // 添加当前活跃状态
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // 如果切换到历史选项卡，加载历史数据
            if (tabId === 'history') {
                loadHistoryData();
            }
        });
    });
}

// 设置周期选择器
function setupPeriodSelector() {
    const periodButtons = document.querySelectorAll('.period-btn');
    
    periodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有活跃状态
            periodButtons.forEach(b => b.classList.remove('active'));
            
            // 添加当前活跃状态
            button.classList.add('active');
            
            // 加载对应天数的历史数据
            const days = parseInt(button.getAttribute('data-period'));
            loadHistoryData(days);
        });
    });
}

// 导出数据功能
function exportNutritionData() {
    // 显示导出中的状态
    const button = document.getElementById('export-data');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 导出中...';
    button.disabled = true;
    
    // 收集所有营养数据
    const allData = {};
    
    // 获取所有保存的键
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // 只导出营养数据相关的键
        if (key.startsWith('nutrition-data-')) {
            allData[key] = JSON.parse(localStorage.getItem(key));
        }
    }
    
    // 转换为JSON字符串
    const dataStr = JSON.stringify(allData, null, 2);
    
    // 创建下载链接
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // 创建一个日期字符串用于文件名
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    // 创建下载元素
    const a = document.createElement('a');
    a.href = url;
    a.download = `营养数据_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        button.innerHTML = '<i class="fas fa-file-export"></i> 导出数据';
        button.disabled = false;
    }, 1000);
}

// 处理导入按钮点击
function handleImportClick() {
    document.getElementById('import-file').click();
}

// 导入数据功能
function importNutritionData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 显示导入中的状态
    const button = document.getElementById('import-data');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 导入中...';
    button.disabled = true;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            // 读取JSON数据
            const importedData = JSON.parse(e.target.result);
            
            // 确认框
            if (confirm('导入将覆盖现有数据，确定要继续吗？')) {
                // 导入所有数据
                for (const key in importedData) {
                    localStorage.setItem(key, JSON.stringify(importedData[key]));
                }
                
                // 更新界面
                checkAndLoadTodayData();
                updateCharts();
                
                // 如果在历史标签页，则刷新历史数据
                if (document.querySelector('.tab[data-tab="history"]').classList.contains('active')) {
                    const activePeriod = document.querySelector('.period-btn.active');
                    const days = parseInt(activePeriod.getAttribute('data-period'));
                    loadHistoryData(days);
                }
                
                alert('数据导入成功！');
            }
        } catch (error) {
            alert('导入失败：文件格式不正确');
            console.error('导入错误:', error);
        }
        
        // 重置文件输入和按钮状态
        document.getElementById('import-file').value = '';
        button.innerHTML = '<i class="fas fa-file-import"></i> 导入数据';
        button.disabled = false;
    };
    
    reader.onerror = function() {
        alert('读取文件时出错');
        button.innerHTML = '<i class="fas fa-file-import"></i> 导入数据';
        button.disabled = false;
    };
    
    // 开始读取文件
    reader.readAsText(file);
}

// 初始化页面
function initPage() {
    // 加载今日数据
    checkAndLoadTodayData();
    
    // 更新图表
    updateCharts();
    
    // 设置选项卡
    setupTabs();
    
    // 设置周期选择器
    setupPeriodSelector();
    
    // 绑定输入事件
    nutrients.forEach(n => {
        document.getElementById(n.targetId).addEventListener('input', updateCharts);
        document.getElementById(n.mealIds.breakfast).addEventListener('input', updateCharts);
        document.getElementById(n.mealIds.lunch).addEventListener('input', updateCharts);
        document.getElementById(n.mealIds.dinner).addEventListener('input', updateCharts);
    });
    
    // 绑定保存按钮事件
    document.getElementById('save-data').addEventListener('click', saveNutritionData);
    // 绑定导出/导入按钮事件
    document.getElementById('export-data').addEventListener('click', exportNutritionData);
    document.getElementById('import-data').addEventListener('click', handleImportClick);
    document.getElementById('import-file').addEventListener('change', importNutritionData);

    // 绑定各个动画播放按钮事件
    document.getElementById('play-all').addEventListener('click', playAllAnimation);
    document.getElementById('play-breakfast').addEventListener('click', playBreakfastAnimation);
    document.getElementById('play-lunch').addEventListener('click', playLunchAnimation);
    document.getElementById('play-dinner').addEventListener('click', playDinnerAnimation);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage); 