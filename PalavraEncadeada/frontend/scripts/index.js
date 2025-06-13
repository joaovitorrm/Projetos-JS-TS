"use strict";
// @ts-ignore
const server = io();
const mainWordDiv = document.querySelector(".main-word");
const otherWordsDiv = document.querySelector(".other-words");
const textInputDiv = document.querySelector(".text-input");
const btnInputDiv = document.querySelector(".btn-input");
btnInputDiv.addEventListener("click", addWord);
textInputDiv.addEventListener("keyup", (e) => {
    if (e.key === "Enter")
        addWord();
});
function addWord() {
    if (textInputDiv.value === "")
        return;
    const spanDiv = document.createElement("span");
    spanDiv.innerText = textInputDiv.value;
    textInputDiv.value = "";
    mainWordDiv.firstElementChild.insertAdjacentElement("afterend", spanDiv);
    otherWordsDiv.appendChild(mainWordDiv.firstElementChild);
}
