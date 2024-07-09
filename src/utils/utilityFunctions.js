import { setLoading, setUserLogin, updateTextData } from "../redux/slices/gameSlice";
import axios from "axios";
import toast from "react-hot-toast";
const backend_url = import.meta.env.VITE_BACKEND_URL;

//update the textData
async function updateTextContent(dispatch, testMode, testName, punctuation, number) {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const url = `${backend_url}/api/data/text`;
    const bodyData = {
        "testMode": `${testMode}`,
        "testName": `${testName}`,
        "punctuation": punctuation,
        "number": number
    }
    dispatch(setLoading(true));
    try {
        const res = await axios.post(url, bodyData);
        const data = res.data.textData.split(" ");
        dispatch(updateTextData(data));
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        dispatch(setLoading(false)); // Hide loading animation
    }
}


async function validateLogin(dispatch) {
    try {
        const response = await fetch(`${backend_url}/api/auth/validate-user`, { method: 'GET', credentials: 'include' });
        if (!response.ok) {
            // Manually throw an error to be caught in the catch block
            const errorData = await response.json();
            throw new Error(errorData?.message || 'Failed to validate user');
        }
        const data = await response.json();
        if (data.success) {
            dispatch(setUserLogin(true));
        } else {
            dispatch(setUserLogin(false));
        }
    } catch (error) {
        dispatch(setUserLogin(false));
        return;
    }
}

// save the user score to DB
async function saveScore(testMode, testName, wpm, accuracy) {
    try {
        const response = await axios.post(`${backend_url}/api/score/save`, { testMode, testName, wpm, accuracy, }, { withCredentials: true });
        toast.success(response.data.message || 'Score saved successfully');
    } catch (error) {
        console.error(error);
        toast.error('An error occured while saving score')
    }
}

//calculate wpm
function getWordsPerMinute(correctLetters, seconds) {
    if (correctLetters === 0) {
        return 0;
    }
    const correct_words = correctLetters / 5;
    const wpm = correct_words * (60 / seconds);
    return wpm.toFixed();
}

// calculate accuracy
function getAccuracy(incorrectLetters, totalTypedLetter) {
    if (incorrectLetters === 0 && totalTypedLetter === 0) {
        return 0;
    }
    const acc = 100 - (incorrectLetters / totalTypedLetter) * 100;
    return acc.toFixed();
}

//caret movement
function moveCaret(caretEl, letterEl, extraBack, isSpace, isBackpace) {
    const offset = 4;
    if (caretEl.current && letterEl.current) {
        const letterOffsetTop = letterEl.current.offsetTop;
        const letterOffsetLeft = letterEl.current.offsetLeft;
        const letterWidth = letterEl.current.offsetWidth;


        if (extraBack) {
            caretEl.current.style.top = `${letterOffsetTop + offset}px`;
            caretEl.current.style.left = `${letterOffsetLeft + letterWidth}px`;
        }

        else {
            if (isSpace || isBackpace) {
                caretEl.current.style.top = `${letterOffsetTop + offset}px`;
                caretEl.current.style.left = `${letterOffsetLeft}px`;
            }
            else {
                caretEl.current.style.top = `${letterOffsetTop + offset}px`;
                caretEl.current.style.left = `${letterOffsetLeft + letterWidth}px`;
            }
        }



    }
}

function updateLine(wordsEl, wordIndex) {
    const wordEl = wordsEl.current.children[wordIndex];
    const wordsY = wordsEl.current.getBoundingClientRect().y;
    const wordY = wordEl.getBoundingClientRect().y;
    if (wordY > wordsY) {
        wordEl.scrollIntoView({ block: "center" });
    }
}

function clearExtraLetters() {
    const extraSpans = document.querySelectorAll(".extra");
    extraSpans.forEach(span => span.remove());
}

function resetCaretPosition(caretEl) {
    if (caretEl.current) {
        caretEl.current.style.left = "0";
        caretEl.current.style.top = "4px"; // Ensure the caret's top position is set
        caretEl.current.style.transition = "none";
        caretEl.current.style.visibility = 'visible'; // Ensure the caret is visible
    }
}

// Logic for  running the TypingTest
function runGame(
    event,
    isBackpace,
    isSpace,
    words,
    wordIndex,
    letterIndex,
    typedWord,
    setTypedWord,
    setTotalCorrectLetter,
    setTotalTypedLetter,
    setIncorrectLetters,
    setTypingTracker,
    setWordIndex,
    setLetterIndex,
    wordsEl,
    letterEl,
    caretEl,
    endGame,
    updateLine,
    moveCaret,
    extraBack
) {
    if (!isBackpace) {
        let inputBoxValue;

        letterEl.current = wordsEl.current.children[wordIndex].children[letterIndex];
        if (!isSpace) {
            inputBoxValue = event.target.value;
            setTypedWord(inputBoxValue);
        }

        if (isSpace) {
            const isOneLetterWord = words[wordIndex]?.length === 1;
            const notFirstLetter = letterIndex !== 0;
            if (isOneLetterWord || notFirstLetter) {
                if (wordIndex === words.length - 1) {
                    endGame();
                }
                if (typedWord === words[wordIndex]) {
                    setTotalCorrectLetter((prev) => prev + 1);
                } else {
                    wordsEl.current.children[wordIndex].classList.add("incorrect-word");
                }
                setTypingTracker((prev) => [...prev, typedWord]);
                setWordIndex((prevWordIndex) => prevWordIndex + 1);
                setLetterIndex(0);
                inputBoxValue = "";
                setTypedWord('');
                letterEl.current = wordsEl.current.children[wordIndex + 1]?.children[0];
            }
        } else if (inputBoxValue.length <= words[wordIndex].length) {
            if (inputBoxValue[letterIndex] === words[wordIndex][letterIndex]) {
                wordsEl.current.children[wordIndex].children[letterIndex].classList.add("correct");
                setLetterIndex((prevInd) => prevInd + 1);
                setTotalTypedLetter((prev) => prev + 1);
                setTotalCorrectLetter((prev) => prev + 1);
                if (wordIndex === words.length - 1 && letterIndex === words[wordIndex].length - 1 && inputBoxValue === words[wordIndex]) {
                    endGame();
                }
            } else {
                wordsEl.current.children[wordIndex].children[letterIndex].classList.add("incorrect");
                setIncorrectLetters((prev) => prev + 1);
                setTotalTypedLetter((prev) => prev + 1);
                setLetterIndex((prevInd) => prevInd + 1);
            }
        } else {
            const extraLetter = document.createElement("span");
            extraLetter.textContent = inputBoxValue[letterIndex];
            extraLetter.classList.add("extra");
            wordsEl.current.children[wordIndex].appendChild(extraLetter);
            letterEl.current = wordsEl.current.children[wordIndex]?.children[letterIndex];

            setLetterIndex((prevInd) => prevInd + 1);
            setIncorrectLetters((prev) => prev + 1);
        }
        updateLine(wordsEl, wordIndex);
        moveCaret(caretEl, letterEl, extraBack, isSpace, isBackpace);
    } else {
        if (letterIndex === 0) {
            return;
        } else {
            const extras = typedWord.length > words[wordIndex].length;
            const targetElement = wordsEl.current.children[wordIndex];
            if (extras) {
                if (targetElement && targetElement.lastChild) {
                    targetElement.removeChild(targetElement.lastChild);
                }
                letterEl.current = wordsEl.current.children[wordIndex]?.children[letterIndex - 2];
                setLetterIndex((prevInd) => prevInd - 1);
                setIncorrectLetters((prev) => prev - 1);
                setTypedWord((prev) => prev.slice(0, -1));
                moveCaret(caretEl, letterEl, extraBack, isSpace, isBackpace);
            } else {
                const targetChild = wordsEl.current.children[wordIndex].children[letterIndex - 1];
                if (targetChild?.classList?.contains('correct')) {
                    setTotalCorrectLetter((prev) => prev - 1);
                }
                if (targetChild) {
                    targetChild.className = '';
                    setLetterIndex((prevInd) => prevInd - 1);
                }
                letterEl.current = wordsEl.current.children[wordIndex]?.children[letterIndex - 1];
                setTypedWord((prev) => prev.slice(0, -1));
                moveCaret(caretEl, letterEl, extraBack, isSpace, isBackpace);
            }
        }
    }
}

function resetClassList(wordsEl) {
    //resetting classlist of each letter
    const childDivs = wordsEl?.current?.querySelectorAll("span > span");
    if (childDivs) {
        for (const childDiv of childDivs) {
            childDiv.classList.remove(...childDiv.classList);
        }
    }
    //resetting the underline of incorrect words 
    const wordss = wordsEl?.current?.querySelectorAll('span');
    if (wordss) {
        for (const word of wordss) {
            word.classList.remove(...word.classList);
        }
    }

}

const handleKeydown = (event, game, startGame, typedWord, words, wordIndex, setExtraBack, setBackspace, setIsSpace) => {
    const isSpecialKey = event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 13 || event.keyCode === 17 || event.keyCode === 18 || event.keyCode === 32;
    if (game === "waiting for input" && (!isSpecialKey)) {
        startGame();
    }

    // If backspace is pressed
    if (event.key === "Backspace") {
        if (typedWord.length > words[wordIndex].length) {
            setExtraBack(true);
        } else {
            setExtraBack(false);
        }
        setBackspace(true);
    } else {
        setExtraBack(false);
        setBackspace(false);
    }

    if (event.key === " ") {
        setIsSpace(true);
    } else {
        setIsSpace(false);
    }
};


export { updateTextContent, handleKeydown, runGame, validateLogin, saveScore, getAccuracy, getWordsPerMinute, moveCaret, updateLine, clearExtraLetters, resetCaretPosition, resetClassList }; 