let myLinks = [];
const input = document.getElementById("input-el");
const inputButton = document.getElementById("input-btn");
const saveCurrentButton = document.getElementById("save-current-btn");
const clearButton = document.getElementById("clear-btn");
const linkList = document.getElementById("link-list");

// Load saved links from Chrome storage
chrome.storage.sync.get(['savedLinks'], function(result) {
  if (result.savedLinks) {
    myLinks = result.savedLinks;
    renderLinks();
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
