"use strict";

const currentBrowser = typeof browser !== "undefined" ? browser : chrome;

const keyboardMoveInput = document.querySelector(".keyboard-move>input");

currentBrowser.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (request.action !== "premoveSubmit" || !request.value) {
      sendResponse({ status: "error" });
      return;
    }

    const moves = request.value.split(" ");

    for (const move of moves) {
      keyboardMoveInput.value = move;
      keyboardMoveInput.focus();

      try {
        const response = await new Promise((resolve) => {
          currentBrowser.runtime.sendMessage(
            { action: "attachDebugger", target: keyboardMoveInput },
            resolve
          );
        });

        if (response && response.status === "success") {
          console.log("Move submitted successfully:", move);
        } else {
          console.error("Error submitting move:", move);
        }

        // Simulate a delay if needed (optional, for example, to avoid race conditions)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error during move submission:", error);
      }
    }
  }
);
