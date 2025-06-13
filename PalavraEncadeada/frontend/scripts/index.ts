// @ts-ignore
const server = io();

const mainWordDiv = document.querySelector(".main-word")! as HTMLDivElement;
const otherWordsDiv = document.querySelector(".other-words")! as HTMLDivElement;
const textInputDiv = document.querySelector(".text-input")! as HTMLInputElement;
const btnInputDiv = document.querySelector(".btn-input")! as HTMLInputElement;

btnInputDiv!.addEventListener("click", addWord)

textInputDiv.addEventListener("keyup", (e) => {
    if (e.key === "Enter") addWord();
})

function addWord() {
    if (textInputDiv.value === "") return;

    const spanDiv = document.createElement("span");

    spanDiv.innerText = textInputDiv.value;

    textInputDiv.value = "";

    mainWordDiv.firstElementChild!.insertAdjacentElement("afterend", spanDiv);

    otherWordsDiv.appendChild(mainWordDiv.firstElementChild!);
}

