// app.js - Side Panel Application Logic

(function() {
  'use strict';
  
  // ========== State Management ==========
  
  let presets = [];
  let config = {
    dashboardTickers: [],
    coloresMetricas: {},
    proActivo: false,
    dashboardEnabled: false,
    metricColorsEnabled: false
  };
  
  // ========== Utility Functions ==========
  
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Simple markdown to HTML converter
  function markdownToHtml(markdown) {
    if (!markdown) return '';
    
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    // Wrap list items
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Wrap in paragraphs
    if (!html.startsWith('<h') && !html.startsWith('<ul')) {
      html = '<p>' + html + '</p>';
    }
    
    return html;
  }
  
  // ========== Storage Functions ==========
  
  async function loadData() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['presets', 'config'], (result) => {
        presets = result.presets || [];
        config = result.config || {
          dashboardTickers: [],
          coloresMetricas: {},
          proActivo: false,
          dashboardEnabled: false,
          metricColorsEnabled: false
        };
        resolve();
      });
    });
  }
  
  async function savePresets() {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ presets }, () => {
        if (chrome.runtime.lastError) {
          // Fallback to local storage if sync quota exceeded
          chrome.storage.local.set({ presets }, resolve);
        } else {
          resolve();
        }
      });
    });
  }
  
  async function saveConfig() {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ config }, () => {
        if (chrome.runtime.lastError) {
          chrome.storage.local.set({ config }, resolve);
        } else {
          resolve();
        }
      });
    });
  }
  
  // ========== Tab Management ==========
  
  function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('tab-active'));
        tab.classList.add('tab-active');
        
        // Update visible content
        contents.forEach(content => {
          content.classList.remove('tab-content-active');
          if (content.id === `tab-${tabName}`) {
            content.classList.add('tab-content-active');
          }
        });
      });
    });
  }
  
  // ========== Presets (Gráficos) ==========
  
  function renderPresets() {
    const listEl = document.getElementById('presets-list');
    
    if (presets.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <p>📊 No hay presets guardados</p>
          <p class="empty-state-hint">Guarda tu primer preset para comenzar</p>
        </div>
      `;
      return;
    }
    
    listEl.innerHTML = '';
    
    presets.forEach(preset => {
      const item = document.createElement('div');
      item.className = 'preset-item';
      item.innerHTML = `
        <div class="preset-header">
          <div class="preset-name">${escapeHtml(preset.nombre)}</div>
          <div class="preset-ticker">${escapeHtml(preset.tickerBase)}</div>
        </div>
        <div class="preset-info">
          ${preset.estado.timeframe || 'N/A'} • 
          ${preset.estado.indicadores?.length || 0} indicadores • 
          Creado ${formatDate(preset.createdAt)}
        </div>
        <div class="preset-actions">
          <button class="btn btn-success btn-apply" data-id="${preset.id}">✓ Aplicar</button>
          <button class="btn btn-secondary btn-duplicate" data-id="${preset.id}">📋 Duplicar</button>
          <button class="btn btn-secondary btn-export" data-id="${preset.id}">📤 Exportar</button>
          <button class="btn btn-danger btn-delete" data-id="${preset.id}">🗑️ Eliminar</button>
        </div>
      `;
      
      listEl.appendChild(item);
    });
    
    // Attach event listeners
    listEl.querySelectorAll('.btn-apply').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.id));
    });
    
    listEl.querySelectorAll('.btn-duplicate').forEach(btn => {
      btn.addEventListener('click', () => duplicatePreset(btn.dataset.id));
    });
    
    listEl.querySelectorAll('.btn-export').forEach(btn => {
      btn.addEventListener('click', () => exportPreset(btn.dataset.id));
    });
    
    listEl.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => deletePreset(btn.dataset.id));
    });
    
    // Update chuletas preset selector
    updateChuletaPresetSelector();
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  async function saveCurrentPreset(nombre) {
    try {
      // Get chart state from content script
      const response = await chrome.runtime.sendMessage({ type: 'GET_CHART_STATE' });
      
      if (!response?.success) {
        alert('No se pudo leer el estado del gráfico. Asegúrate de estar en una página de Tweenvest.');
        return;
      }
      
      const preset = {
        id: generateId(),
        nombre: nombre,
        tickerBase: response.estado.ticker || 'UNKNOWN',
        vendor: 'tweenvest',
        estado: response.estado,
        notasMarkdown: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      presets.push(preset);
      await savePresets();
      renderPresets();
      alert('✓ Preset guardado correctamente');
    } catch (error) {
      console.error('Error saving preset:', error);
      alert('Error al guardar preset');
    }
  }
  
  async function applyPreset(id) {
    const preset = presets.find(p => p.id === id);
    if (!preset) return;
    
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'APPLY_CHART_STATE',
        estado: preset.estado
      });
      
      if (response?.success) {
        alert('✓ Preset aplicado correctamente');
      } else {
        alert('Error al aplicar preset: ' + (response?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error applying preset:', error);
      alert('Error al aplicar preset');
    }
  }
  
  function duplicatePreset(id) {
    const preset = presets.find(p => p.id === id);
    if (!preset) return;
    
    const duplicate = {
      ...preset,
      id: generateId(),
      nombre: preset.nombre + ' (copia)',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    presets.push(duplicate);
    savePresets();
    renderPresets();
  }
  
  function exportPreset(id) {
    const preset = presets.find(p => p.id === id);
    if (!preset) return;
    
    const dataStr = JSON.stringify(preset, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `preset-${preset.nombre.replace(/\s+/g, '-')}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  function deletePreset(id) {
    if (!confirm('¿Eliminar este preset?')) return;
    
    presets = presets.filter(p => p.id !== id);
    savePresets();
    renderPresets();
  }
  
  function importPreset() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const preset = JSON.parse(event.target.result);
          preset.id = generateId(); // New ID
          preset.createdAt = Date.now();
          preset.updatedAt = Date.now();
          
          presets.push(preset);
          savePresets();
          renderPresets();
          alert('✓ Preset importado correctamente');
        } catch (error) {
          alert('Error al importar preset: formato JSON inválido');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }
  
  // ========== Chuletas (Notes) ==========
  
  function updateChuletaPresetSelector() {
    const select = document.getElementById('chuleta-preset-select');
    select.innerHTML = '<option value="">-- Seleccionar preset --</option>';
    
    presets.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.id;
      option.textContent = `${preset.nombre} (${preset.tickerBase})`;
      select.appendChild(option);
    });
  }
  
  function loadChuletaForPreset(presetId) {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;
    
    const editor = document.getElementById('chuleta-editor');
    editor.value = preset.notasMarkdown || '';
  }
  
  function saveChuletaForPreset() {
    const select = document.getElementById('chuleta-preset-select');
    const presetId = select.value;
    
    if (!presetId) {
      alert('Selecciona un preset primero');
      return;
    }
    
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;
    
    const editor = document.getElementById('chuleta-editor');
    preset.notasMarkdown = editor.value;
    preset.updatedAt = Date.now();
    
    savePresets();
    alert('✓ Chuleta guardada');
  }
  
  function previewChuleta() {
    const editor = document.getElementById('chuleta-editor');
    const preview = document.getElementById('chuleta-preview');
    
    if (preview.classList.contains('hidden')) {
      const html = markdownToHtml(editor.value);
      preview.innerHTML = html;
      preview.classList.remove('hidden');
      document.getElementById('btn-preview-chuleta').textContent = '✕ Cerrar Preview';
    } else {
      preview.classList.add('hidden');
      document.getElementById('btn-preview-chuleta').textContent = '👁️ Preview';
    }
  }
  
  // ========== Dashboard ==========
  
  function renderDashboardTickers() {
    const listEl = document.getElementById('dashboard-tickers-list');
    listEl.innerHTML = '';
    
    if (config.dashboardTickers.length === 0) {
      listEl.innerHTML = '<div class="help-text">No hay tickers seleccionados</div>';
      return;
    }
    
    config.dashboardTickers.forEach((ticker, index) => {
      const tag = document.createElement('div');
      tag.className = 'ticker-tag';
      tag.innerHTML = `
        ${escapeHtml(ticker)}
        <span class="ticker-tag-remove" data-index="${index}">✕</span>
      `;
      listEl.appendChild(tag);
    });
    
    // Attach remove listeners
    listEl.querySelectorAll('.ticker-tag-remove').forEach(span => {
      span.addEventListener('click', () => {
        const index = parseInt(span.dataset.index);
        config.dashboardTickers.splice(index, 1);
        saveConfig();
        renderDashboardTickers();
        updateDashboard();
      });
    });
  }
  
  function addDashboardTicker() {
    const input = document.getElementById('dashboard-ticker-input');
    const ticker = input.value.trim().toUpperCase();
    
    if (!ticker) return;
    if (config.dashboardTickers.includes(ticker)) {
      alert('Este ticker ya está en la lista');
      return;
    }
    
    config.dashboardTickers.push(ticker);
    input.value = '';
    saveConfig();
    renderDashboardTickers();
    updateDashboard();
  }
  
  async function updateDashboard() {
    const enabled = document.getElementById('dashboard-enabled').checked;
    config.dashboardEnabled = enabled;
    await saveConfig();
    
    chrome.runtime.sendMessage({
      type: 'UPDATE_DASHBOARD',
      tickers: config.dashboardTickers,
      enabled: enabled
    });
  }
  
  // ========== Metric Colors ==========
  
  function renderMetricColors() {
    const listEl = document.getElementById('metric-colors-list');
    listEl.innerHTML = '';
    
    const metrics = Object.entries(config.coloresMetricas);
    if (metrics.length === 0) {
      listEl.innerHTML = '<div class="help-text">No hay colores configurados</div>';
      return;
    }
    
    metrics.forEach(([metrica, color]) => {
      const item = document.createElement('div');
      item.className = 'metric-color-item';
      item.innerHTML = `
        <div class="metric-color-info">
          <div class="metric-color-swatch" style="background-color: ${color};"></div>
          <div class="metric-color-name">${escapeHtml(metrica)}</div>
        </div>
        <button class="btn btn-danger btn-sm" data-metric="${escapeHtml(metrica)}">✕</button>
      `;
      listEl.appendChild(item);
    });
    
    // Attach remove listeners
    listEl.querySelectorAll('.btn-danger').forEach(btn => {
      btn.addEventListener('click', () => {
        const metrica = btn.dataset.metric;
        delete config.coloresMetricas[metrica];
        saveConfig();
        renderMetricColors();
        updateMetricColors();
      });
    });
  }
  
  function addMetricColor() {
    const nameInput = document.getElementById('metric-name-input');
    const colorInput = document.getElementById('metric-color-input');
    
    const metrica = nameInput.value.trim();
    const color = colorInput.value;
    
    if (!metrica) {
      alert('Ingresa el nombre de la métrica');
      return;
    }
    
    config.coloresMetricas[metrica] = color;
    nameInput.value = '';
    saveConfig();
    renderMetricColors();
    updateMetricColors();
  }
  
  async function updateMetricColors() {
    const enabled = document.getElementById('metric-colors-enabled').checked;
    config.metricColorsEnabled = enabled;
    await saveConfig();
    
    chrome.runtime.sendMessage({
      type: 'UPDATE_METRIC_COLORS',
      colors: config.coloresMetricas,
      enabled: enabled
    });
  }
  
  // ========== Comparador ==========
  
  function compareMetrics() {
    alert('⚠️ Funcionalidad de comparador en desarrollo.\n\nRequiere integración con datos de Tweenvest.');
    
    // Placeholder for comparison logic
    const metric = document.getElementById('compare-metric').value;
    const tickersInput = document.getElementById('compare-tickers-input').value;
    const tickers = tickersInput.split(',').map(t => t.trim()).filter(t => t);
    
    console.log('Comparing', metric, 'for tickers:', tickers);
    
    // Would render chart here with real data
    const resultEl = document.getElementById('compare-result');
    resultEl.classList.remove('hidden');
  }
  
  // ========== Event Listeners ==========
  
  function initEventListeners() {
    // Presets
    document.getElementById('btn-save-preset').addEventListener('click', () => {
      document.getElementById('save-preset-modal').classList.remove('hidden');
    });
    
    document.getElementById('btn-confirm-save-preset').addEventListener('click', () => {
      const nombre = document.getElementById('preset-name-input').value.trim();
      if (!nombre) {
        alert('Ingresa un nombre para el preset');
        return;
      }
      saveCurrentPreset(nombre);
      document.getElementById('save-preset-modal').classList.add('hidden');
      document.getElementById('preset-name-input').value = '';
    });
    
    document.getElementById('btn-cancel-save-preset').addEventListener('click', () => {
      document.getElementById('save-preset-modal').classList.add('hidden');
      document.getElementById('preset-name-input').value = '';
    });
    
    document.getElementById('btn-import-preset').addEventListener('click', importPreset);
    
    // Chuletas
    document.getElementById('chuleta-preset-select').addEventListener('change', (e) => {
      loadChuletaForPreset(e.target.value);
    });
    
    document.getElementById('btn-save-chuleta').addEventListener('click', saveChuletaForPreset);
    document.getElementById('btn-preview-chuleta').addEventListener('click', previewChuleta);
    
    // Dashboard
    document.getElementById('dashboard-enabled').addEventListener('change', updateDashboard);
    
    document.getElementById('btn-add-ticker').addEventListener('click', addDashboardTicker);
    
    document.getElementById('dashboard-ticker-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addDashboardTicker();
      }
    });
    
    // Metric Colors
    document.getElementById('metric-colors-enabled').addEventListener('change', () => {
      const enabled = document.getElementById('metric-colors-enabled').checked;
      const configEl = document.getElementById('metric-colors-config');
      if (enabled) {
        configEl.classList.remove('hidden');
      } else {
        configEl.classList.add('hidden');
      }
      updateMetricColors();
    });
    
    document.getElementById('btn-add-metric-color').addEventListener('click', addMetricColor);
    
    // Comparador
    document.getElementById('btn-compare').addEventListener('click', compareMetrics);
  }
  
  // ========== Initialization ==========
  
  async function init() {
    await loadData();
    
    initTabs();
    initEventListeners();
    
    renderPresets();
    renderDashboardTickers();
    renderMetricColors();
    
    // Set checkbox states
    document.getElementById('dashboard-enabled').checked = config.dashboardEnabled;
    document.getElementById('metric-colors-enabled').checked = config.metricColorsEnabled;
    
    if (config.metricColorsEnabled) {
      document.getElementById('metric-colors-config').classList.remove('hidden');
    }
    
    // Update pro status
    const proStatus = document.getElementById('pro-status');
    if (config.proActivo) {
      proStatus.textContent = 'PRO ✓';
      proStatus.style.backgroundColor = 'var(--success)';
      proStatus.style.color = 'white';
    }
  }
  
  // Start the app
  init();
  
})();
