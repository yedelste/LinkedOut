function isHomePageUrl() {
  const url = window.location.href;
  // Only apply on LinkedIn feed/home page
  return url.includes('/feed/') 
}

function replaceFeed() {
  if (!isHomePageUrl()) return;

  const main = document.querySelector("main");

  if (!main) return;

  // Prevent duplicate injection
  if (document.getElementById("nothing-to-see-overlay")) return;

  // Hide existing LinkedIn content
  main.innerHTML = "";

  const overlay = document.createElement("div");
  overlay.id = "nothing-to-see-overlay";

  overlay.innerHTML = `
    <div class="nts-card">
      <h1>Nothing to see here! Ever!</h1>
      <p>
        Go do literally anything else.
      </p>
    </div>
  `;

  main.appendChild(overlay);
}

// Check if we're already on the feed when page loads
replaceFeed();

// Hook into History API (pushState/replaceState) - this is what SPAs use
// Set this up IMMEDIATELY so we catch navigation no matter where we are
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;

window.history.pushState = function(...args) {
  const result = originalPushState.apply(this, args);
  setTimeout(() => {
    replaceFeed();
  }, 50);
  return result;
};

window.history.replaceState = function(...args) {
  const result = originalReplaceState.apply(this, args);
  setTimeout(() => {
    replaceFeed();
  }, 50);
  return result;
};

// Listen for browser back/forward
window.addEventListener('popstate', () => {
  replaceFeed();
});

// LinkedIn dynamically reloads parts of the page,
// so we keep watching for changes.
function setupObserver() {
  if (!document.body) {
    setTimeout(setupObserver, 100);
    return;
  }
  
  const observer = new MutationObserver(() => {
    replaceFeed();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

setupObserver();