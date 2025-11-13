let myLinks = [];
const input = document.getElementById("input-el");
const inputButton = document.getElementById("input-btn");
const saveCurrentButton = document.getElementById("save-current-btn");
const clearButton = document.getElementById("clear-btn");
const linkList = document.getElementById("link-list");
const settingsToggle = document.getElementById("settings-toggle");
const settingsPanel = document.getElementById("settings-panel");
const apiKeyInput = document.getElementById("api-key-input");
const saveApiKeyButton = document.getElementById("save-api-key-btn");
const syncNowButton = document.getElementById("sync-now-btn");
const syncStatus = document.getElementById("sync-status");

let apiKey = '';
let syncInProgress = false;

// Load saved links and API key from Chrome storage
chrome.storage.sync.get(['savedLinks', 'apiKey'], function(result) {
  if (result.savedLinks) {
    myLinks = result.savedLinks;
    renderLinks();
  }
  if (result.apiKey) {
    apiKey = result.apiKey;
    apiKeyInput.value = apiKey;
    // Auto-sync on startup if API key is set
    setTimeout(() => {
      syncWithServer();
    }, 1000);
  }
});

// Save links to Chrome storage
function saveLinks() {
  chrome.storage.sync.set({savedLinks: myLinks});
}

// Render the links list
function renderLinks() {
  let listItems = "";
  for (let i = 0; i < myLinks.length; i++) {
    const link = myLinks[i];
    const domain = new URL(link).hostname;
    listItems += `
      <li>
        <div class="link-item">
          <a href="${link}" target="_blank" class="link-url">${link}</a>
          <div class="link-domain">${domain}</div>
          <button class="delete-btn" data-index="${i}">Delete</button>
        </div>
      </li>
    `;
  }
  linkList.innerHTML = listItems;
  
  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      myLinks.splice(index, 1);
      saveLinks();
      renderLinks();
    });
  });
}

// Save manually entered link
inputButton.addEventListener("click", (e) => {
  const url = input.value.trim();
  if (url && isValidUrl(url)) {
    if (!myLinks.includes(url)) {
      myLinks.push(url);
      saveLinks();
      renderLinks();
      input.value = "";
    } else {
      alert("This link is already saved!");
    }
  } else {
    alert("Please enter a valid URL");
  }
});

// Save current page
saveCurrentButton.addEventListener("click", (e) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentUrl = tabs[0].url;
    if (!myLinks.includes(currentUrl)) {
      myLinks.push(currentUrl);
      saveLinks();
      renderLinks();
    } else {
      alert("This page is already saved!");
    }
  });
});

// Clear all links
clearButton.addEventListener("click", (e) => {
  if (confirm("Are you sure you want to clear all saved links?")) {
    myLinks = [];
    saveLinks();
    renderLinks();
  }
});

// Validate URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Allow Enter key to save
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    inputButton.click();
  }
});

// Settings panel toggle
settingsToggle.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
});

// Save API key
saveApiKeyButton.addEventListener("click", () => {
  const newApiKey = apiKeyInput.value.trim();
  if (newApiKey) {
    apiKey = newApiKey;
    chrome.storage.sync.set({ apiKey: apiKey }, () => {
      showSyncStatus("API key saved!", "success");
    });
  } else {
    showSyncStatus("Please enter an API key", "error");
  }
});

// Sync now
syncNowButton.addEventListener("click", () => {
  if (!apiKey) {
    showSyncStatus("Please set your API key first", "error");
    return;
  }
  syncWithServer();
});

// Show sync status message
function showSyncStatus(message, type = "") {
  syncStatus.textContent = message;
  syncStatus.className = `sync-status ${type}`;

  if (type === "success" || type === "error") {
    setTimeout(() => {
      syncStatus.textContent = "";
      syncStatus.className = "sync-status";
    }, 3000);
  }
}

// Sync with server
async function syncWithServer() {
  if (syncInProgress) {
    showSyncStatus("Sync already in progress...", "");
    return;
  }

  if (!apiKey) {
    showSyncStatus("API key not set", "error");
    return;
  }

  syncInProgress = true;
  showSyncStatus("Syncing...", "");

  try {
    // First, push local links to server
    const response = await fetch('http://localhost:3000/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        links: myLinks.map(url => ({ url }))
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync with server');
    }

    const syncResult = await response.json();

    // Then, fetch all links from server
    const fetchResponse = await fetch('http://localhost:3000/api/sync', {
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!fetchResponse.ok) {
      throw new Error('Failed to fetch links from server');
    }

    const data = await fetchResponse.json();

    // Merge server links with local links
    const serverUrls = data.links.map(link => link.url);
    myLinks = [...new Set([...myLinks, ...serverUrls])]; // Remove duplicates

    saveLinks();
    renderLinks();

    showSyncStatus(`Synced! ${syncResult.created} created, ${syncResult.skipped} skipped`, "success");
  } catch (error) {
    console.error('Sync error:', error);
    showSyncStatus("Sync failed. Check your API key and connection.", "error");
  } finally {
    syncInProgress = false;
  }
}
