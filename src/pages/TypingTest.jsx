import { useState, useEffect, useRef } from "react";
import { updateGameState, updateTextData } from "../redux/slices/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import TestSettingsBar from "../components/TestSettingsBar";
import TestResult from "../components/TestResult";
import TextLoadingAnimation from "../components/LoadingAnimation";

//importing utilityFunctions 
import { saveScore, runGame, getAccuracy, handleKeydown, resetClassList, getWordsPerMinute, moveCaret, updateLine, clearExtraLetters, resetCaretPosition, updateTextContent, } from "../utils/utilityFunctions";



function App() {

  const dispatch = useDispatch();
  //global states
  const game = useSelector(state => state.mainGame.gameState);
  const apiTextData = useSelector(state => state.mainGame.textData);
  const userLoggedIn = useSelector(state => state.mainGame.isUserLoggedIn);
  const loading = useSelector(state => state.mainGame.loading);

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
  const isFirstRender = useRef(true);

  //variables and states declaration 
  const [WPM, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [words, setWords] = useState([]);
  const [seconds, setSeconds] = useState(testName);
  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [typedWord, setTypedWord] = useState(""); // refrencing the input box
  const [incorrectLetters, setIncorrectLetters] = useState(0); // for calculating accuracy
  const [totalTypedLetter, setTotalTypedLetter] = useState(0); // for calculation accuracy
  const [totalCorrectLetter, setTotalCorrectLetter] = useState(0);
  const [typingTracker, setTypingTracker] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [isSpace, setIsSpace] = useState(false);
  const [isBackpace, setBackspace] = useState(false);
  const [extraBack, setExtraBack] = useState(false);  // for handling erasing(backSpace) of the the extra typed letter 


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
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      resetGame();
      focusInput();
    }
  }, [testType, testName, isPunc, isNum]);


  function handleKeydownWrapper(event) {
    handleKeydown(event, game, startGame, typedWord, words, wordIndex, setExtraBack, setBackspace, setIsSpace);
  };

  function startGame() {
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

  function handleTyping(event) {
    runGame(
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
    )
  }

  async function endGame() {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
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

  async function handleGameOver() {
    setTimeout(() => {
      dispatch(updateGameState("game over"));
    }, 0);

    // Retrieve state values synchronously using Promises
    const totalIncorrectLetters = await new Promise(resolve => {
      setIncorrectLetters(prev => {
        resolve(prev);
        return prev; // Returning previous state as we are not updating incorrectLetters here
      });
    });

    const totalTypedLetters = await new Promise(resolve => {
      setTotalTypedLetter(prev => {
        resolve(prev);
        return prev; // Returning previous state as we are not updating totalTypedLetters here
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
    const a = getAccuracy(totalIncorrectLetters, totalTypedLetters);

    // Update state with the new values
    setWPM(w);
    setAccuracy(a);

    // Save the score if the user is logged in
    if (userLoggedIn) {
      await saveScore('time', (testName + 'sec'), w, a);
    }
  }

  //reset the whole typingTest
  function resetGame() {
    dispatch(updateGameState("waiting for input"));
    clearInterval(intervalRef?.current);
    setSeconds(testName);
    setTypedWord("");
    setTotalCorrectLetter(0);
    setWordIndex(0);
    setLetterIndex(0);
    setIncorrectLetters(0);
    setTotalTypedLetter(0);
    setTypingTracker([]);
    setAccuracy(0);
    setWPM(0);
    clearExtraLetters();
    resetClassList(wordsEl);
    resetCaretPosition(caretEl);
    if (wordsEl.current) {
      wordsEl.current.scrollTop = 0; // Scroll to the top
    }
  }

  return (
    <div className="w-full p-4 mx-auto custom-height bg-gray-50 dark:bg-slate-800">
      <TestSettingsBar />

      {game !== "game over" && (
        <div className="relative max-w-screen-xl p-8 max-[500px]:px-1 mx-auto">
          <input
            ref={inputEl}
            value={typedWord}
            onKeyDown={handleKeydownWrapper}
            onChange={handleTyping}
            className="absolute opacity-0"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
          />
          <div
            className={`${game === "in progress" ? "opacity-1" : "opacity-0"} text-2xl font-semibold dark:text-yellow-500 text-primary transition-all duration-300`}
          >
            {testType === 'word' ? typingTracker.length + "/" + words.length : seconds}
          </div>

          {loading ?
            <div>
              <TextLoadingAnimation />
            </div> : <div className="min-h-[160px]">
              <div
                ref={wordsEl}
                className="relative  flex max-h-[160px]  w-full select-none flex-wrap gap-5 overflow-hidden font-mono text-3xl font-medium leading-[40px] dark:text-slate-500  text-slate-400  "
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
            </div>}



          <div className="flex justify-center w-full mt-8">
            <button
              className="py-2.5 px-5 me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-slate-500 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600 select-none"
              onClick={() => {
                updateTextContent(dispatch, testType, testName, isPunc, isNum);
                resetGame();
              }}
              aria-label="reset"
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {game === "game over" && (
        <TestResult
          WPM={WPM}
          accuracy={accuracy}
          wpmref={wpmref}
          accref={accref}
          resetGame={() => {
            updateTextContent(dispatch, testType, testName, isPunc, isNum);
            resetGame();
          }}
          userLoggedIn={userLoggedIn}
        />
      )}

    </div>
  );
}

export default App;
