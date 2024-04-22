//The Bot class for the Travel Helper Chatbot

const { response } = require("express");

//Importing the chat and inputs as defined from the DOM
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

//As we need the responses for the bot in one place, let us build an array for it
let BOT_RESPONSES = {};

const BOT_IMG = "https://e7.pngegg.com/pngimages/498/917/png-clipart-computer-icons-desktop-chatbot-icon-blue-angle.png";
const PERSON_IMG = "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png";

//Everyone needs names, even bots. User name is User.
const BOT_NAME = "Jackslov";
const PERSON_NAME = "User";

//Listen to the submit event, referenced in the index.html document
msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value();
    console.log("User Input:", msgText);

    botResponse();
})

//Since we already have a chat container, this functions appends it into it.
function appendMessage(name, img, side, text) {
    //   Simple solution for small apps -- Author's note
    const msgHTML = `
      <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>
  
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${formatDate(new Date())}</div>
          </div>
  
          <div class="msg-text">${text}</div>
        </div>
      </div>
    `;
  
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}
//An array of previous responses to implement a basic recollection of inputs.
let previousReponses = [];
//A variable which switches between different fallback statements.
var sw = 1;

function botResponse() {
    const userMsg = msgerInput.value.toLowerCase();
    console.log("User Message:", userMsg);
    console.log("Bot Responses:", BOT_RESPONSES);
    //If it has already been logged, then it is repeated, and so we should mention that, at least.
    if (previousReponses.hasOwnProperty(userMsg)) {
        appendMessage(BOT_NAME, BOT_IMG, "left", "it appears like you've said that before.")
    }

    if (!BOT_RESPONSES.hasOwnProperty(userMsg)) {
      appendMessage(BOT_NAME, BOT_IMG, "left", swtch());
      return;
    }
    const typingMsg = "...";
    appendMessage(BOT_NAME, BOT_IMG, "left", typingMsg);
  
    //Pause because why not
    setTimeout(() => {
      const botMsg = BOT_RESPONSES[userMsg];
      const messages = Array.from(msgerChat.querySelectorAll(".msg-text"));
      const lastMSGIndex = messages.findIndex(msg => msg.innerText === "...");
      if (lastMSGIndex !== -1) {
        messages[lastMSGIndex].parentElement.parentElement.remove();
      }


      appendMessage(BOT_NAME, BOT_IMG, "left", botMsg);
    }, 2000);
    previousReponses.push(userMsg);
}

//switch help function between fallback statements
function swtch() {
    if (sw.equals(1)) {
      sw = 2;
      return "Sorry I didn't really get that. Can you try again ?";
    } else {
      sw = 1;
      return "I didn't understand that, I'm afraid. Could please repeat it ?";
    }
}

//import responses
fetch("./rsp.json")
    .then(response => response.json())
    .then(data => {
        //Since we have implemented the BOT_RESPONSES earlier, we should now start filling it.
        Object.assign(BOT_RESPONSES, data);
    })
    .catch(error => {
        console.error("Error loading bot responses:", error);
    });

// Utility classes -- gotten from the source website of the template
function get(selector, root = document) {
    return root.querySelector(selector);
}
  
function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
  
    return `${h.slice(-2)}:${m.slice(-2)}`;
}
  
function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
  