"use strict";

const searchInput = document.querySelector("#search-input");
const showSearchedWord = document.querySelector("#show-word");
const showPhoneticElem = document.querySelector("#show-phonetic");
const audioElem = document.querySelector("audio");
const showDescription = document.querySelector("#show-decription");
const wordPart = document.querySelector(".word-part");
const playBtn = document.querySelector("#play-btn");
const showSynonymElem = document.querySelector("#show-synonym");
const showAntonymElem = document.querySelector("#show-antonym");
const loader = document.querySelector(".loader");
const searchBtn = document.querySelector("#search-btn");
const alertElement = document.querySelector(".alert-container");
let checkUserInternet = false;

// fetching word and error handling
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
const alertHandler = (errorText) => {
    alertElement.classList.add("active");
  let alertHtmlCode = `
  <div class="delete">
     &#x2715
   </div>
   <p>${errorText}</p>
  `;
  alertElement.insertAdjacentHTML("beforeend", alertHtmlCode);
  setTimeout(() => alertElement.classList.remove("active"), 3000);
};

const showWordDetails = (response) => {

  let vocab = word[0];

    wordPart.style.display = "block";
    loader.style.display = "none";

    showSearchedVocabulary.innerHTML = vocab.word;

    phoneticHandler(vocab);
    showSynonym(vocab);
    showAntonym(vocab);
    voiceHandler(vocab);
    showDescription.innerHTML = vocab.meanings[0].definitions[0].definition;

};

function phoneticHandler(word) {
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
}

function showPhonetic(partOfSpeech, phonetic) {
  showPhoneticElem.innerHTML = `${partOfSpeech}  ${phonetic}`;
}

function voiceHandler(word) {
  let findVoice = word.phonetics.find((item) => {
    return item.audio;
  });
  if (!findVoice) {
    console.log("not found voice");
    alertHandler("unfortunately this word don't have voice");
    return false;
  }
  audioElem.src = findVoice.audio;
  playBtn.onclick = () => {
    audioElem.play();
  };
}

function showSynonym(word) {
  let synonymArray = [];
  let filterSynonyms = word.meanings.filter((item) => {
    return item.synonyms.length > 0;
  });

  if (filterSynonyms.length != 0) {
    let findSynonyms = filterSynonyms.find((item) => {
      return item.synonyms;
    });
    synonymArray = findSynonyms.synonyms;
  } else {
    showSynonymElem.parentElement.style.display = "none";
    return false;
  }

  showSynonymElem.parentElement.style.display = "inline-flex";

  if (synonymArray.length > 4) {
    synonymArray = synonymArray.slice(0, 4);
  }

  showSynonymElem.innerHTML = "";
  let htmlCode = "";
  synonymArray.forEach((item) => {
    htmlCode += `<li> ${item}</li>
     `;
  });
  showSynonymElem.insertAdjacentHTML("beforeend", htmlCode);
}

function showAntonym(word) {
  let antonymsArray = [];
  let filterAntonyms = word.meanings.filter((item) => {
    return item.antonyms.length > 0;
  });

  if (filterAntonyms.length != 0) {
    let findAntonyms = filterAntonyms.find((item) => {
      return item.antonyms;
    });
    antonymsArray = findAntonyms.antonyms;
  } else {
    showAntonymElem.parentElement.style.display = "none";
    return false;
  }

  showAntonymElem.parentElement.style.display = "inline-flex";

  if (antonymsArray.length > 4) {
    antonymsArray = antonymsArray.slice(0, 4);
  }

  showAntonymElem.innerHTML = "";
  let htmlCode = "";
  antonymsArray.forEach((item) => {
    htmlCode += `<li>${item}</li>`;
  });
  showAntonymElem.insertAdjacentHTML("beforeend", htmlCode);
}

document.addEventListener("DOMContentLoaded", function () {
  navigator.onLine ? (checkUserInternet = true) : (checkUserInternet = false);
});

navigator.connection.onchange = () => {
  console.log("change net");
  navigator.onLine ? (checkUserInternet = true) : (checkUserInternet = false);
};

searchInput.addEventListener("keyup", (event) => {
  if (event.keyCode == 13) {
    if (!checkUserInternet) {
      alertHandler("you are not online!");
      return false;
    }
    if (searchInput.value == "") {
      alertHandler("enter your word plz!");
      return false;
    }
    fetchWord(searchInput.value);
  }
});

searchBtn.addEventListener("click", () => {
  if (!checkUserInternet) {
    alertHandler("you are not online!");
    return false;
  }
  if (searchInput.value == "") {
    alertHandler("enter your word plz!");
    return false;
  }
  fetchWord(searchInput.value);
});
