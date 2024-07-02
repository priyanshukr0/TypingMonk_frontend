import { useState, useEffect, useRef } from "react";
import { updateGameState, updateTextData } from "../redux/slices/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import textData from "../utils/textApi";
import HomePage from "./HomePage";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function App() {

  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const game = useSelector(state => state.mainGame.gameState);
  const apiTextData = useSelector(state => state.mainGame.textData);
  const userLoggedIn = useSelector(state => state.mainGame.isUserLoggedIn);

  //importing testSetting states
  const testName = useSelector(state => state.mainGame.testSettings.testName);
  const testType = useSelector(state => state.mainGame.testSettings.testType);
  const isPunc = useSelector(state => state.mainGame.testSettings.isPunc);
  const isNum = useSelector(state => state.mainGame.testSettings.isNum);

  //all refs intialization
  const intervalRef = useRef(null);
  const inputEl = useRef(null);
  const wordsEl = useRef(null);
  const caretEl = useRef(null);
  const letterEl = useRef(null);
  const wpmref = useRef(null);
  const accref = useRef(null);

  const [WPM, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [words, setWords] = useState([]);
  const [seconds, setSeconds] = useState(testName);
  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [typedWord, setTypedWord] = useState(""); // refrencing the input box
  const [incorrectLetters, setIncorrectLetters] = useState(0); // for calculating accuracy
  const [totalTypedLetter, setTotalTypedLetter] = useState(0); // for calculation accuracy
  const [correctWords, setCorrectWords] = useState([]); // for calculation words per minute
  const [totalCorrectLetter, setTotalCorrectLetter] = useState(0);

  const [extraBack, setExtraBack] = useState(false);  // for handling erasing(backSpace) of the the extra typed letter 
  const [typingTracker, setTypingTracker] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const [isBackpace, setBackspace] = useState(false);
  const [isSpace, setIsSpace] = useState(false);

  async function saveScore(testMode, testName, wpm, accuracy) {
    try {
      const response = await axios.post(`${backend_url}/api/score/save`, { testMode, testName, wpm, accuracy, }, { withCredentials: true });
      toast.success(response.data.message || 'Score saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('An error occured while saving score')
    }
  }

  async function refreshTextData() {
    const ans = await textData(testType, testName, isPunc, isNum);
    const data = ans.data.textData.split(" ");
    dispatch(updateTextData(data));
  }

  function focusInput() {
    inputEl?.current?.focus();
  }
  function renderText() {
    setWords(apiTextData);
  }
  useEffect(() => {
    renderText();
    focusInput();
  }, [apiTextData]);

  useEffect(() => {
    resetGame();
    focusInput();
  }, [testType, testName, isPunc, isNum]);


  function startGame() {
    // console.log('startGame function is called ')
    dispatch(updateGameState("in progress"))
    setGameTimer();
  }

  function setGameTimer() {
    clearInterval(intervalRef?.current);

    if (testType === 'time') {
      const interval = setInterval(async () => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else if (prevSeconds === 0) {
            clearInterval(interval);
            handleGameOver();
            return prevSeconds; // Return 0 to stop the timer
          }
        });
      }, 1000);
      intervalRef.current = interval;
    } else if (testType === 'word') {
      setStartTime(Date.now());
    }
  }

  async function handleGameOver() {
    setTimeout(() => {
      dispatch(updateGameState("game over"));
    }, 0);

    // Retrieve state values synchronously using Promises
    const currentIncorrectLetters = await new Promise(resolve => {
      setIncorrectLetters(prev => {
        resolve(prev);
        return prev; // Returning previous state as we are not updating incorrectLetters here
      });
    });

    const currentTotalTypedLetters = await new Promise(resolve => {
      setTotalTypedLetter(prev => {
        resolve(prev);
        return prev; // Returning previous state as we are not updating totalTypedLetters here
      });
    });

    const currentCorrectWords = await new Promise(resolve => {
      setCorrectWords(prevCorrectWords => {
        resolve(prevCorrectWords);
        return prevCorrectWords; // Returning previous state as we are not updating correctWords here
      });
    });

    const correctLetters = await new Promise(resolve => {
      setTotalCorrectLetter(val => {
        resolve(val);
        return val;
      })
    })
    // Perform calculations
    const w = getWordsPerMinute(correctLetters, seconds);
    const a = getAccuracy(currentIncorrectLetters, currentTotalTypedLetters);

    // Update state with the new values
    setWPM(w);
    setAccuracy(a);

    // Save the score if the user is logged in
    if (userLoggedIn) {
      await saveScore('time', (testName + 'sec'), w, a);
    }
  }


  function updateLine() {
    const wordEl = wordsEl.current.children[wordIndex];
    const wordsY = wordsEl.current.getBoundingClientRect().y;
    const wordY = wordEl.getBoundingClientRect().y;
    if (wordY > wordsY) {
      wordEl.scrollIntoView({ block: "center" });
    }
  }

  function moveCaret() {
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

  function clearExtraLetters() {
    const extraSpans = document.querySelectorAll(".extra");
    extraSpans.forEach(span => span.remove());
  }

  function resetCaretPosition() {
    if (caretEl.current) {
      caretEl.current.style.left = "0";
      caretEl.current.style.top = "4px"; // Ensure the caret's top position is set
      caretEl.current.style.transition = "none";
      caretEl.current.style.visibility = 'visible'; // Ensure the caret is visible
    }
  }

  function resetGame() {
    dispatch(updateGameState("waiting for input"));
    clearInterval(intervalRef?.current);
    refreshTextData();
    setSeconds(testName);
    setTypedWord("");
    setTotalCorrectLetter(0);
    setWordIndex(0);
    setLetterIndex(0);
    setIncorrectLetters(0);
    setTotalTypedLetter(0);
    setCorrectWords([]);
    setTypingTracker([]);
    setAccuracy(0);
    setWPM(0);
    clearExtraLetters();
    resetClassList();
    resetCaretPosition();
    if (wordsEl.current) {
      wordsEl.current.scrollTop = 0; // Scroll to the top
    }
    setTimeout(() => {
      focusInput();
    }, 0);
  }

  function getWordsPerMinute(correctLetters, seconds) {
    if (correctLetters === 0) {
      return 0;
    }
    const correct_words = correctLetters / 5;
    const wpm = correct_words * (60 / seconds);
    return wpm.toFixed();
  }

  function getAccuracy(incorrectLetters, totalTypedLetter) {
    if (incorrectLetters === 0 && totalTypedLetter === 0) {
      return 0;
    }
    const acc = 100 - (incorrectLetters / totalTypedLetter) * 100;
    return acc.toFixed();
  }

  async function endGame() {
    setEndTime(Date.now());
    const endT = Date.now();
    const timeTaken = (endT - startTime) / 1000;
    dispatch(updateGameState("game over"));

    let incorrect = await new Promise(resolve => {
      setIncorrectLetters(prev => {
        resolve(prev);
        return prev;
      })
    })
    let totalLetter = await new Promise(resolve => {
      setTotalTypedLetter(prev => {
        resolve(prev);
        return prev;
      })
    })
    let noOfCorrectWords = await new Promise(resolve => {
      setCorrectWords(prev => {
        resolve(prev.length);
        return prev;
      })
    })
    const correctLetters = await new Promise(resolve => {
      setTotalCorrectLetter(val => {
        resolve(val);
        return val;
      })
    })
    const w = getWordsPerMinute(correctLetters, timeTaken);
    const a = getAccuracy(incorrect, totalLetter);
    setWPM(w);
    setAccuracy(a);

    if (userLoggedIn) {
      await saveScore('word', (testName + 'words'), w, a);
    }

  }
  function handleKeydown(event) {

    const isSpecialKey = event.keyCode === 8 || event.keyCode === 9 || event.keyCode === 13 || event.keyCode === 17 || event.keyCode === 18 || event.keyCode === 32;
    if (game === "waiting for input" && (!isSpecialKey)) {
      startGame();
    }

    //if backspace is pressed
    if (event.keyCode === 8) {
      if (typedWord.length > words[wordIndex].length) {
        setExtraBack(true);
      }
      else {
        setExtraBack(false);
      }
      setBackspace(true);

    } else {
      setExtraBack(false);
      setBackspace(false);
    }

    if (event.keyCode === 32) {
      setIsSpace(true);
    } else {
      setIsSpace(false);
    }
  }

  function runGame(event) {

    // if backSpace is not pressed 
    if (!isBackpace) {
      let inputBoxValue;

      //setting it for the movement of caret to the next letter
      letterEl.current = wordsEl.current.children[wordIndex].children[letterIndex];
      if (!isSpace) {
        inputBoxValue = event.target.value;
        setTypedWord(inputBoxValue);
      }
      //if space is pressed
      if (isSpace) {
        const isOneLetterWord = words[wordIndex]?.length === 1;
        const notFirstLetter = letterIndex !== 0;
        if (isOneLetterWord || notFirstLetter) {
          // if the Typedword is correct 
          if (wordIndex === words.length - 1) {
            endGame();
          }
          if (typedWord === words[wordIndex]) {
            setCorrectWords((prev) => {
              return [...prev, words[wordIndex]]; // Return the updated state
            });
            setTotalCorrectLetter(prev => prev + 1);
          } else {
            wordsEl.current.children[wordIndex].classList.add("incorrect-word");
          }
          setTypingTracker((prev) => {
            return [...prev, typedWord];
          });
          setWordIndex((prevWordIndex) => prevWordIndex + 1);
          setLetterIndex(0);
          inputBoxValue = "";
          setTypedWord('');
          letterEl.current = wordsEl.current.children[wordIndex + 1]?.children[0];
        }
      } else if (inputBoxValue.length <= words[wordIndex].length) {
        if (inputBoxValue[letterIndex] === words[wordIndex][letterIndex]) {
          wordsEl.current.children[wordIndex].children[letterIndex].classList.add("correct");
          setLetterIndex((prevInd) => prevInd + 1); // increaseing the letter index
          setTotalTypedLetter((prev) => prev + 1); // increasing the total typed letter
          setTotalCorrectLetter(prev => prev + 1);
          if (wordIndex === words.length - 1) {
            if (letterIndex === words[wordIndex].length - 1) {
              if (inputBoxValue === words[wordIndex]) {
                endGame();
              }
            }
          }
        } else {
          wordsEl.current.children[wordIndex].children[letterIndex].classList.add("incorrect");

          setIncorrectLetters((prev) => prev + 1); // increasing the incorrect letter
          setTotalTypedLetter((prev) => prev + 1); // increasing the total typed letter
          setLetterIndex((prevInd) => prevInd + 1); // increaseing the letter index
        }
      } else {
        const extraLetter = document.createElement("span");
        extraLetter.textContent = inputBoxValue[letterIndex];
        extraLetter.classList.add("extra");
        wordsEl.current.children[wordIndex].appendChild(extraLetter);
        letterEl.current = wordsEl.current.children[wordIndex]?.children[letterIndex];

        setLetterIndex((prevInd) => prevInd + 1); // increaseing the letter index
        setIncorrectLetters((prev) => prev + 1); // increasing the incorrect letter
      }
      updateLine();
      moveCaret();
    }
    //if BackSpace is pressed
    else {
      if (letterIndex === 0) {
        //if backspace is pressed and on the first letter of the word then do nothing
        return;
      }
      else {
        //if incorrect and extra letter but on the same word 
        let extras = typedWord.length > words[wordIndex].length;
        const targetElement = wordsEl.current.children[wordIndex]
        if (extras) {
          if (targetElement && targetElement.lastChild) {
            targetElement.removeChild(targetElement.lastChild);
          }
          letterEl.current = wordsEl.current.children[wordIndex]?.children[letterIndex - 2];
          setLetterIndex((prevInd) => prevInd - 1);
          setIncorrectLetters((prev) => prev - 1);
          setTypedWord(prev => {
            return prev.slice(0, -1);
          })
          moveCaret();
        } else {
          const targetChild = wordsEl.current.children[wordIndex].children[letterIndex - 1];
          if (targetChild?.classList?.contains('correct')) {
            setTotalCorrectLetter(prev => prev - 1);
          }
          if (targetChild) {
            targetChild.className = ''; // This will remove all classes from the last child
            setLetterIndex((prevInd) => prevInd - 1);
          }
          letterEl.current = wordsEl.current.children[wordIndex]?.children[letterIndex - 1];
          setTypedWord(prev => {
            return prev.slice(0, -1);
          })
          moveCaret();

        }
      }

    }
  }

  function resetClassList() {
    const childDivs = wordsEl?.current?.querySelectorAll("span > span");
    if (childDivs) {
      for (const childDiv of childDivs) {
        childDiv.classList.remove(...childDiv.classList);
      }
    }
    const wordss = wordsEl?.current?.querySelectorAll('span');
    if (wordss) {
      for (const word of wordss) {
        word.classList.remove(...word.classList);
      }
    }

  }
  return (
    <div className="w-full p-4 mx-auto custom-height bg-gray-50 dark:bg-slate-800">
      <HomePage />

      {game !== "game over" && (
        <div className="relative max-w-screen-xl p-8 max-[500px]:px-1 mx-auto">
          <input
            ref={inputEl}
            value={typedWord}
            onKeyDown={handleKeydown}
            onChange={runGame}
            className="absolute opacity-0"
            type="text"
          />
          <div
            className={`${game === "in progress" ? "opacity-1" : "opacity-0"} text-2xl font-semibold dark:text-yellow-500 text-primary transition-all duration-300`}
          >
            {testType === 'word' ? typingTracker.length + "/" + words.length : seconds}
          </div>

          <div
            ref={wordsEl}
            className="relative  transition-all flex max-h-[160px] w-full select-none flex-wrap gap-5 overflow-hidden font-mono text-3xl font-medium leading-[40px] dark:text-slate-500  text-slate-400  "
            onClick={focusInput}
          >
            {words.map((word, index) => (
              <span key={index} className="flex items-end " >
                {word.split("").map((letter, index) => (
                  <span
                    key={index}
                    ref={index === 0 ? letterEl : null}
                    className={`relative`}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            ))}
            <div
              ref={caretEl}
              className="absolute top-1  h-[2.1rem] border-r-[2.2px] border-primary transition-all "
            />
          </div>

          <div className="flex justify-center w-full mt-8">
            <button
              className="py-2.5 px-5 me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-slate-500 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600 select-none"
              onClick={resetGame}
              aria-label="reset"
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {game === "game over" && (
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between w-full p-6">
            <div>
              <div className="mb-5 text-6xl font-medium text-slate-800 dark:text-slate-200">Test Result</div>
              <div className="px-3 mb-4">
                <p className="mb-2 text-4xl text-zinc-900 dark:text-slate-200">wpm</p>
                <p ref={wpmref} className="text-6xl font-semibold text-primary">
                  {WPM}
                </p>
              </div>
              <div className="px-3 mb-6">
                <p className="mb-2 text-4xl text-zinc-900 dark:text-slate-200">accuracy</p>
                <p ref={accref} className="text-6xl font-semibold text-primary">{accuracy}%</p>
              </div>
              <button
                className="mt-3 text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={resetGame}
              >
                Restart Test
              </button>
            </div>
            {!userLoggedIn &&
              <div className="mx-auto my-auto text-3xl font-medium text-slate-900 dark:text-slate-200">
                Please login to save Test Result <Link to={'/login'}><span className="mx-2 font-medium text-indigo-600 dark:hover:text-sky-400 dark:text-sky-500 hover:text-indigo-500">Log In</span></Link>
              </div>
            }


          </div>
        </div>

      )}

    </div>
  );
}

export default App;
