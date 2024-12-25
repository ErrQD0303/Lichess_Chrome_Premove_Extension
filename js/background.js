"use strict";

const currentBrowser = typeof browser !== "undefined" ? browser : chrome;

currentBrowser.tabs.onUpdated.addListener((tabId, _, tab) => {
  const popupUrl =
    tab.url && tab.url.includes("lichess.org") ? "popup.html" : "";
  currentBrowser.action.setPopup({ popup: popupUrl, tabId });
});

currentBrowser.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.action !== "attachDebugger") return false;

    currentBrowser.tabs.query(
      { active: true, currentWindow: true, url: "*://*.lichess.org/*" },
      (tabs) => {
        const tabId = tabs[0]?.id;

        if (!tabId) {
          sendResponse({ status: "error", message: "No active tab found" });
          return;
        }

        currentBrowser.debugger.attach({ tabId }, "1.2", () => {
          if (currentBrowser.runtime.lastError) {
            sendResponse({
              status: "error",
              message: currentBrowser.runtime.lastError.message,
            });
            return;
          }

          currentBrowser.debugger.sendCommand(
            { tabId },
            "Input.dispatchKeyEvent",
            {
              type: "keyUp",
              key: request.target,
              modifiers: 0,
              timestampt: Date.now(),
              keyIdentifier: "Enter",
              code: "Enter",
              key: "Enter",
              windowsVirtualKeyCode: 13,
              nativeVirtualKeyCode: 13,
              autoRepeat: false,
              isKeypad: false,
              isSystemKey: false,
            },
            () => {
              chrome.debugger.detach({ tabId });
              sendResponse({ status: "success" });
            }
          );
        });
      }
    );

    return true;
  }
);
