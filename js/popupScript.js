"use strict";
const popupScript = () => {
  const input = document.querySelector("#premove-input");

  const onInputSubmit = (e) => {
    if (e.key !== "Enter") return;
    if (!input) return;

    // Listen for messages from the popup script
    const currentBrowser = typeof browser !== "undefined" ? browser : chrome;

    const message = { action: "premoveSubmit", value: input.value };

    currentBrowser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        currentBrowser.tabs.sendMessage(tabs[0].id, message, (response) => {
          if (currentBrowser.runtime.lastError) {
            console.log(currentBrowser.runtime.lastError);
          } else if (response && response.status === "success") {
            console.log("Success");
            window.close(); // Close the popup
          }
        });
      }
    });

    input.value = "";
  };

  input.addEventListener("keyup", onInputSubmit);

  input.focus();
};

document.addEventListener("DOMContentLoaded", popupScript);
