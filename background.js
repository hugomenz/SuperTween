// background.js - Service Worker for SPTween Extension
// Handles Side Panel management, keyboard shortcuts, and message passing

// Open Side Panel when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;
  
  try {
    await chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: 'sidepanel/index.html',
      enabled: true
    });
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (error) {
    console.error('Error opening side panel:', error);
  }
});

// Handle keyboard shortcuts (Alt+S)
chrome.commands?.onCommand.addListener(async (cmd) => {
  if (cmd === 'toggle_panel') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      try {
        await chrome.sidePanel.setOptions({
          tabId: tab.id,
          path: 'sidepanel/index.html',
          enabled: true
        });
        await chrome.sidePanel.open({ tabId: tab.id });
      } catch (error) {
        console.error('Error toggling side panel:', error);
      }
    }
  }
});

// Handle messages from content scripts and side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CHART_STATE') {
    // Forward to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'READ_CHART_STATE' }, (response) => {
          sendResponse(response);
        });
      }
    });
    return true; // Will respond asynchronously
  }
  
  if (message.type === 'APPLY_CHART_STATE') {
    // Forward to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'APPLY_CHART_STATE',
          estado: message.estado
        }, (response) => {
          sendResponse(response);
        });
      }
    });
    return true;
  }
  
  if (message.type === 'UPDATE_DASHBOARD') {
    // Forward to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_DASHBOARD',
          tickers: message.tickers,
          enabled: message.enabled
        }, (response) => {
          sendResponse(response);
        });
      }
    });
    return true;
  }
  
  if (message.type === 'UPDATE_METRIC_COLORS') {
    // Forward to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'APPLY_METRIC_COLORS',
          colors: message.colors,
          enabled: message.enabled
        }, (response) => {
          sendResponse(response);
        });
      }
    });
    return true;
  }
});

// Initialize on installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('SPTween extension installed');
    
    // Set default configuration
    const defaultConfig = {
      dashboardTickers: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'],
      coloresMetricas: {},
      proActivo: false,
      dashboardEnabled: false,
      metricColorsEnabled: false
    };
    
    await chrome.storage.sync.set({ config: defaultConfig });
  }
});

console.log('SPTween background service worker loaded');
