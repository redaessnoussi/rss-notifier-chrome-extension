// add.js
document.addEventListener("DOMContentLoaded", function () {
  var readRSSButton = document.getElementById("addFeed");
  readRSSButton.addEventListener("click", function () {
    addRssURL();
  });
});

function addRssURL() {
  var rssInput = document.getElementById("rssInput");
  var rssURL = rssInput.value.trim();

  // Fetch and display the new RSS feed
  // fetchRssData(rssURL);

  // Save the new feed URL to storage
  chrome.storage.sync.get(["rssFeeds"], function (result) {
    var rssFeeds = result.rssFeeds || [];
    rssFeeds.push(rssURL);
    chrome.storage.sync.set({ rssFeeds: rssFeeds });
  });
  // Notify the background script about the new feed URL
  chrome.runtime.sendMessage({ action: "newFeedAdded", data: rssURL });
}

// Getting the added RSS Feeds URL's as an array
// Function to handle messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "storedFeeds") {
    var storedFeeds = request.data;
    console.log("Stored feeds:", storedFeeds);

    var storedRssFeeds = document.getElementById("storedRss");
    storedRssFeeds.innerHTML = "";

    for (let index = 0; index < storedFeeds.length; index++) {
      const feed = storedFeeds[index];

      // Create a new link element
      var linkElement = document.createElement("a");
      linkElement.href = "#"; // Set href to "#" to prevent page reload
      linkElement.classList.add("feedURL");
      linkElement.innerText = `Feed ${index}`;

      // Add a click event listener to the link
      linkElement.addEventListener("click", function () {
        chrome.runtime.sendMessage({ action: "selectedFeedItem", data: feed });
      });

      // Create a new paragraph element and append the link to it
      var paragraphElement = document.createElement("p");
      paragraphElement.appendChild(linkElement);

      // Append the paragraph element to the container
      storedRssFeeds.appendChild(paragraphElement);
    }
  }
});