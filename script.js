"use strict";
import colors from "./colors.js";

const searchInput = document.querySelector("#search-input");
const showSearchedWord = document.querySelector("#show-word");
const showPhoneticElem = document.querySelector("#show-phonetic");
const audioElem = document.querySelector("audio");
const showDescription = document.querySelector("#show-decription");
const wordPart = document.querySelector(".word-details-part");
const playBtn = document.querySelector("#play-btn");
const showSynonymElem = document.querySelector("#show-synonym");
const showAntonymElem = document.querySelector("#show-antonym");
const loader = document.querySelector(".loader");
const searchBtn = document.querySelector("#search-btn");
const alertElement = document.querySelector(".alert-container");
const colorIcons = document.querySelectorAll(".color");
const root = document.querySelector(":root");
const colorsContainer = document.querySelector(".color-palate");
let isUserOnline = true;

//handling colors
const handleColorsPalate = () => {
  colors.forEach((color) => {
    let colorElem = document.createElement("div");
    colorElem.setAttribute("title", "change color");
    colorElem.classList.add("color");
    colorElem.style.backgroundColor = `var(--${color.colorCode})`;
    colorsContainer.append(colorElem);

    colorElem.addEventListener("click", () => {
      root.style.setProperty("--mainColor", `var(--${color.colorCode})`);
      root.style.setProperty("--hoverColor", color.hoverColor);
    });
  });
};
const fetchWord = async (searchWord) => {
  wordPart.style.display = "none";
  loader.style.display = "inline-block";

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
    );
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    showWordDetails(data);
  } catch (error) {
    loader.style.display = "none";
    if (error.status === 404) {
      alertHandler("can't find this word!!!");
    }
  }
};
const submitInput = () => {
  searchInput.value = searchInput.value.trim();

  if (!isUserOnline) {
    alertHandler("you are not online!");
    return false;
  }
  if (searchInput.value === "") {
    alertHandler("enter your word pease!");
    return false;
  }
  fetchWord(searchInput.value.toLowerCase());
};
const alertHandler = (errorText) => {
  alertElement.innerHTML = "";
  alertElement.classList.add("active");
  let alertHtmlCode = `
  <div class="close-icon">&#x2715</div>
   <p>${errorText}</p>
  `;
  alertElement.insertAdjacentHTML("beforeend", alertHtmlCode);

  setTimeout(() => alertElement.classList.remove("active"), 3000);
};
const showWordDetails = (response) => {
  let vocab = response[0];
  wordPart.style.display = "block";
  loader.style.display = "none";

  showSearchedWord.innerHTML = vocab.word;

  phoneticHandler(vocab);
  showSynonym(vocab);
  showAntonym(vocab);
  voiceHandler(vocab);
  showDescription.innerHTML = vocab.meanings[0].definitions[0].definition;
};
const phoneticHandler = (word) => {
  let phonetic = word.meanings[0].partOfSpeech;

  //if don't find the phonetic
  if (!word.phonetic) {
    let findPhonetic = word.phonetics.find((item) => {
      return item.text;
    });

    if (!findPhonetic) {
      showPhonetic(phonetic, "");
      return false;
    } else {
      showPhonetic(phonetic, findPhonetic.text);
    }
  } else {
    showPhonetic(phonetic, word.phonetic);
  }
};
const showPhonetic = (partOfSpeech, phonetic) => {
  showPhoneticElem.innerHTML = `${partOfSpeech}  ${phonetic}`;
};
const voiceHandler = (word) => {
  let wordAudio = word.phonetics.find((item) => {
    return item.audio;
  });
  playBtn.classList.replace("fa-volume-mute", "fa-volume-up");
  playBtn.classList.remove("diActive");

  if (!wordAudio) {
    playBtn.classList.replace("fa-volume-up", "fa-volume-mute");
    playBtn.classList.add("diActive");

    return false;
  }

  audioElem.src = wordAudio.audio;
  playBtn.onclick = () => {
    audioElem.play();
  };
};
const createLiElem = (container, array) => {
  let htmlItems = "";
  container.innerHTML = "";

  array.forEach((item) => {
    htmlItems += `<li> ${item}</li>`;
  });
  container.insertAdjacentHTML("beforeend", htmlItems);
};
const showSynonym = (word) => {
  let synonymArray = [];
  const filterSynonyms = word.meanings.filter((item) => {
    return item.synonyms.length > 0;
  });

  if (filterSynonyms.length) {
    const findSynonyms = filterSynonyms.find((item) => {
      return item.synonyms;
    });
    synonymArray = findSynonyms.synonyms;
  } else {
    showSynonymElem.innerHTML = "-";
    return false;
  }

  if (synonymArray.length > 4) {
    synonymArray = synonymArray.slice(0, 4);
  }
  createLiElem(showSynonymElem, synonymArray);
};
const showAntonym = (word) => {
  let antonymsArray = [];
  const filterAntonyms = word.meanings.filter((item) => {
    return item.antonyms.length > 0;
  });

  if (filterAntonyms.length) {
    let findAntonyms = filterAntonyms.find((item) => {
      return item.antonyms;
    });
    antonymsArray = findAntonyms.antonyms;
  } else {
    showAntonymElem.innerHTML = "-";
    return false;
  }

  if (antonymsArray.length > 4) {
    antonymsArray = antonymsArray.slice(0, 4);
  }
  createLiElem(showAntonymElem, antonymsArray);
};

const checkUserNet = () => (isUserOnline = navigator.onLine);
document.addEventListener("DOMContentLoaded", checkUserNet);
navigator.connection.addEventListener("change", checkUserNet);
searchBtn.addEventListener("click", submitInput);
searchInput.addEventListener("keyup", (e) => e.keyCode === 13 && submitInput());
handleColorsPalate()
