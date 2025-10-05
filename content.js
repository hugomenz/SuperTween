// content.js - Content Script for SPTween Extension
// Interacts with Tweenvest DOM to read/apply chart states and inject custom UI

(function() {
  'use strict';
  
  console.log('SPTween content script loaded');
  
  // ========== Chart State Management ==========
  
  /**
   * Read current chart state from Tweenvest page
   */
  async function leerEstadoGrafico() {
    try {
      // Prefer public API if exists
      if (window.tweenvestChart?.getState) {
        return window.tweenvestChart.getState();
      }
      
      // Fallback: inspect DOM controls
      const estado = {
        timeframe: '1D',
        indicadores: [],
        overlays: [],
        layout: {},
        ticker: null
      };
      
      // Try to read ticker from URL or DOM
      const urlMatch = window.location.pathname.match(/\/stocks\/([A-Z0-9]+)/i);
      if (urlMatch) {
        estado.ticker = urlMatch[1];
      }
      
      // Try to read timeframe
      const timeframeBtn = document.querySelector('[data-testid="timeframe"]') ||
                          document.querySelector('.timeframe-selector') ||
                          document.querySelector('[class*="timeframe"]');
      if (timeframeBtn) {
        estado.timeframe = timeframeBtn.value || timeframeBtn.textContent?.trim() || '1D';
      }
      
      // Try to read indicators
      const indicatorChips = document.querySelectorAll('.indicator-chip, [class*="indicator"]');
      estado.indicadores = Array.from(indicatorChips)
        .map(chip => chip.textContent?.trim())
        .filter(text => text && text.length > 0);
      
      // Try to read overlays
      const overlayElements = document.querySelectorAll('.overlay-item, [class*="overlay"]');
      estado.overlays = Array.from(overlayElements)
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 0);
      
      return estado;
    } catch (error) {
      console.error('Error reading chart state:', error);
      return null;
    }
  }
  
  /**
   * Apply chart state to Tweenvest page
   */
  async function aplicarEstadoGrafico(estado) {
    try {
      // Prefer public API if exists
      if (window.tweenvestChart?.setState) {
        window.tweenvestChart.setState(estado);
        return { success: true };
      }
      
      // Fallback: manipulate DOM controls
      
      // Apply timeframe
      const timeframeBtn = document.querySelector('[data-testid="timeframe"]') ||
                          document.querySelector('.timeframe-selector');
      if (timeframeBtn && estado.timeframe) {
        if (timeframeBtn.tagName === 'SELECT') {
          timeframeBtn.value = estado.timeframe;
          timeframeBtn.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          // Try to click the button with matching text
          const buttons = document.querySelectorAll('button');
          for (const btn of buttons) {
            if (btn.textContent?.trim() === estado.timeframe) {
              btn.click();
              break;
            }
          }
        }
      }
      
      // Apply indicators (this is site-specific, generic approach)
      if (estado.indicadores?.length > 0) {
        console.log('Applying indicators:', estado.indicadores);
        // Site-specific logic would go here
      }
      
      // Apply overlays
      if (estado.overlays?.length > 0) {
        console.log('Applying overlays:', estado.overlays);
        // Site-specific logic would go here
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error applying chart state:', error);
      return { success: false, error: error.message };
    }
  }
  
  // ========== Custom Dashboard ==========
  
  let originalDashboard = null;
  let customDashboardEnabled = false;
  
  /**
   * Mount custom dashboard with user-selected tickers
   */
  function montarDashboard(tickers, enabled) {
    try {
      // Find the main dashboard container
      const host = document.querySelector('#dashboard-root') ||
                  document.querySelector('[class*="dashboard"]') ||
                  document.querySelector('main');
      
      if (!host) {
        console.warn('Dashboard host not found');
        return;
      }
      
      // If disabling, restore original
      if (!enabled) {
        if (originalDashboard) {
          host.style.display = '';
        }
        const customDash = document.getElementById('spt-dashboard');
        if (customDash) {
          customDash.remove();
        }
        customDashboardEnabled = false;
        return;
      }
      
      // Save original dashboard if not already saved
      if (!originalDashboard && !customDashboardEnabled) {
        originalDashboard = host.cloneNode(true);
      }
      
      // Hide original dashboard
      const originalContent = host.querySelector(':scope > *:not(#spt-dashboard)');
      if (originalContent) {
        originalContent.style.display = 'none';
      }
      
      // Create or update custom dashboard
      let cont = document.getElementById('spt-dashboard');
      if (!cont) {
        cont = document.createElement('div');
        cont.id = 'spt-dashboard';
        cont.className = 'spt-dashboard-container';
        host.appendChild(cont);
      }
      
      cont.innerHTML = '';
      
      // Create ticker cards
      const grid = document.createElement('div');
      grid.className = 'spt-dashboard-grid';
      
      tickers.forEach(ticker => {
        const card = document.createElement('a');
        card.className = 'spt-card';
        card.href = `/stocks/${ticker}`;
        card.innerHTML = `
          <div class="spt-card-ticker">${ticker}</div>
          <div class="spt-card-info">Ver detalles →</div>
        `;
        grid.appendChild(card);
      });
      
      cont.appendChild(grid);
      customDashboardEnabled = true;
      
    } catch (error) {
      console.error('Error mounting dashboard:', error);
    }
  }
  
  // ========== Metric Colors ==========
  
  const COMMON_METRICS = [
    'ROIC', 'ROE', 'ROA', 'Margen', 'Margen Bruto', 'Margen Operativo',
    'Margen Neto', 'Deuda/EBITDA', 'EV/EBITDA', 'P/E', 'PER',
    'Debt/Equity', 'Current Ratio', 'Quick Ratio'
  ];
  
  /**
   * Apply color highlighting to metrics
   */
  function aplicarColoresMetricas(colores, enabled) {
    try {
      // Find all metric elements
      const metricElements = document.querySelectorAll('[class*="metric"], [class*="ratio"], td, span');
      
      metricElements.forEach(el => {
        const text = el.textContent?.trim();
        
        if (!enabled) {
          // Remove custom colors
          if (el.dataset.sptOriginalColor) {
            el.style.color = el.dataset.sptOriginalColor;
            delete el.dataset.sptOriginalColor;
          }
          return;
        }
        
        // Check if element contains a known metric
        for (const [metrica, color] of Object.entries(colores)) {
          if (text && text.includes(metrica)) {
            if (!el.dataset.sptOriginalColor) {
              el.dataset.sptOriginalColor = el.style.color || '';
            }
            el.style.color = color;
            break;
          }
        }
      });
    } catch (error) {
      console.error('Error applying metric colors:', error);
    }
  }
  
  // ========== Message Listener ==========
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'READ_CHART_STATE') {
      leerEstadoGrafico().then(estado => {
        sendResponse({ success: true, estado });
      });
      return true;
    }
    
    if (message.type === 'APPLY_CHART_STATE') {
      aplicarEstadoGrafico(message.estado).then(result => {
        sendResponse(result);
      });
      return true;
    }
    
    if (message.type === 'UPDATE_DASHBOARD') {
      montarDashboard(message.tickers, message.enabled);
      sendResponse({ success: true });
      return true;
    }
    
    if (message.type === 'APPLY_METRIC_COLORS') {
      aplicarColoresMetricas(message.colors, message.enabled);
      sendResponse({ success: true });
      return true;
    }
  });
  
  // ========== Initialize ==========
  
  // Load config and apply dashboard/colors if enabled
  chrome.storage.sync.get(['config'], (result) => {
    if (result.config) {
      if (result.config.dashboardEnabled) {
        montarDashboard(result.config.dashboardTickers || [], true);
      }
      if (result.config.metricColorsEnabled) {
        aplicarColoresMetricas(result.config.coloresMetricas || {}, true);
      }
    }
  });
  
  // Re-apply on navigation (SPA support)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      chrome.storage.sync.get(['config'], (result) => {
        if (result.config?.dashboardEnabled) {
          setTimeout(() => montarDashboard(result.config.dashboardTickers || [], true), 500);
        }
      });
    }
  }).observe(document, { subtree: true, childList: true });
  
})();
