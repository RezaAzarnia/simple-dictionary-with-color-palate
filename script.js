"use strict"

const searchInput = document.querySelector("#search-input")
const showWord = document.querySelector("#show-word")
const showPhoneticElem = document.querySelector("#show-phonetic")
const audioElem = document.querySelector("audio")
const showDescription = document.querySelector("#show-decription")
const wordPart = document.querySelector(".word-part")
const playBtn = document.querySelector("#play-btn")
const showSynonymElem = document.querySelector("#show-synonym")
const showAntonymElem = document.querySelector("#show-antonym")
const loader = document.querySelector(".loader")
console.log(loader);

function searchWord(e) {
    if (e.keyCode == 13) {
        console.log("fetching word");
        fetchWord(searchInput.value)
    }
}

async function fetchWord(searchWord) {
    wordPart.style.display = 'none'
    loader.style.display = "inline-block"
    await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
        .then(res => {
            console.log(res);
            if (res.status == 200) {
                return res.json()
            } else if (res.status == 404) {
                return false
            }
        })
        .then(word => {
            console.log(word);
            showResponse(word)
        }).catch(err => {
            console.log(err);

            // alert("can't find this word")
        })

}

function showPhonetic(partOfSpeech, phonetic) {
    showPhoneticElem.innerHTML = `${partOfSpeech}  ${phonetic}`

}

function showResponse(word) {
    wordPart.style.display = "block"
    loader.style.display = "none"
    let vocab = word[0]
    let phonetic = vocab.meanings[0].partOfSpeech;

    showWord.innerHTML = vocab.word
    voiceHandler(vocab)

    if (vocab.phonetic == undefined) {
        let findPhonetic = vocab.phonetics.find(item => {
            return item.text
        })

        if (findPhonetic == undefined) {
            showPhonetic(phonetic, "")
            return false
        }

        showPhonetic(phonetic, findPhonetic.text)

    } else {
        showPhonetic(phonetic, vocab.phonetic)
    }

    showDescription.innerHTML = vocab.meanings[0].definitions[0].definition
    showSynonym(vocab)
    showAntonym(vocab)

}

function voiceHandler(word) {
    let findVoice = word.phonetics.find(item => {
        return item.audio
    })
    audioElem.src = findVoice.audio
    playBtn.onclick = () => {
        audioElem.play()
    }
}


function showSynonym(word) {
    let synonymArray = []
    let filterSynonyms = word.meanings.filter(item => {
        return item.synonyms.length > 0
    })

    if (filterSynonyms.length != 0) {

        let findSynonyms = filterSynonyms.find(item => {
            return item.synonyms
        })
        synonymArray = findSynonyms.synonyms

    } else {
        showSynonymElem.parentElement.style.display = "none"
        return false
    }

    showSynonymElem.parentElement.style.display = "block"

    if (synonymArray.length > 4) {
        synonymArray = synonymArray.slice(0, 4)
    }

    showSynonymElem.innerHTML = ""
    let htmlCode = ""
    synonymArray.forEach(item => {
        htmlCode += `${item} - `
    })
    showSynonymElem.insertAdjacentHTML("beforeend", htmlCode)

}




function showAntonym(word) {
    let antonymsArray = []
    let filterAntonyms = word.meanings.filter(item => {
        return item.antonyms.length > 0
    })

    if (filterAntonyms.length != 0) {

        let findAntonyms = filterAntonyms.find(item => {
            return item.antonyms
        })
        antonymsArray = findAntonyms.antonyms

    } else {
        showAntonymElem.parentElement.style.display = "none"
        return false
    }

    showAntonymElem.parentElement.style.display = "block"

    if (antonymsArray.length > 4) {
        antonymsArray = antonymsArray.slice(0, 4)
    }

    showAntonymElem.innerHTML = ""
    let htmlCode = ""
    antonymsArray.forEach(item => {
        htmlCode += `${item} - `
    })
    showAntonymElem.insertAdjacentHTML("beforeend", htmlCode)
}
searchInput.addEventListener("keyup", event => searchWord(event))
window.addEventListener('load', fetchWord("hi"))