import React, { useEffect, useState } from "react";
import { updateTestSettings, updateTextData } from "../redux/slices/gameSlice";
import textData from "../utils/textApi";
import { useDispatch, useSelector } from "react-redux";


export default function HomePage() {

  const dispatch = useDispatch();

  const gameState = useSelector(state => state.mainGame.gameState);
  // importing the testSettings states from the reduxToolkit 
  const testName = useSelector(state => state.mainGame.testSettings.testName);
  const testType = useSelector(state => state.mainGame.testSettings.testType);
  const isPunc = useSelector(state => state.mainGame.testSettings.isPunc);
  const isNum = useSelector(state => state.mainGame.testSettings.isNum);


  useEffect(() => {
    const storedTestName = localStorage.getItem('testName') || '10';
    const storedTestType = localStorage.getItem('testType') || 'word';

    dispatch(updateTestSettings({ key: 'testType', value: storedTestType }));
    dispatch(updateTestSettings({ key: 'testName', value: storedTestName }));

  }, [])

  function handleTestName(value) {
    dispatch(updateTestSettings({ key: 'testName', value: value }))
    localStorage.setItem("testName", value);
  }
  function toggleNumCheck() {
    dispatch(updateTestSettings({ key: 'isNum', value: !isNum }))
    // localStorage.setItem('isNum', !isNum);
  }
  function togglePuncCheck() {
    dispatch(updateTestSettings({ key: 'isPunc', value: !isPunc }))
    // localStorage.setItem('isPunc', !isPunc);
  }
  const onCategoryChange = (value) => {
    dispatch(updateTestSettings({ key: 'testType', value: value }))
    dispatch(updateTestSettings({ key: 'testName', value: '10' }))

    localStorage.setItem('testType', value);
    localStorage.setItem('testName', '10');
  };

  useEffect(() => {

    async function fetchText() {
      const ans = await textData(testType, testName, isPunc, isNum);
      const data = ans.data.textData.split(" ");
      dispatch(updateTextData(data));
    }
    fetchText();
  }, [testType, testName, isPunc, isNum]);

  return (


    <div>
      {gameState !== 'game over' && (
        <div className="mx-auto max-w-[900px] my-3 max-[820px]:justify-normal flex-wrap max-[820px]:gap-3 flex justify-around w-[100%] min-[970px]:w-[90%] min-[1070px]:w-[80%]  rounded-lg  bg-slate-200 dark:bg-slate-700 p-2 shadow-md">
          <div className="w-[16%] max-[821px]:w-[45%] max-[821px]:justify-evenly flex justify-between max-[320px]:pr-2 max-[350px]:justify-between pr-4 font-semibold border-r-2 border-red-400 items-center">
            <div
              className={`${isPunc ? ' text-slate-950 dark:text-gray-100' : 'text-slate-500 dark:text-gray-400'
                } cursor-pointer select-none transition-colors duration-200`}
              onClick={togglePuncCheck}
            >
              @Punc
            </div>
            <div
              className={`${isNum ? ' text-slate-950 dark:text-gray-100' : 'text-slate-500 dark:text-gray-400'
                } cursor-pointer select-none font-semibold transition-colors duration-200`}
              onClick={toggleNumCheck}
            >
              #Num
            </div>
          </div>

          {/* <div>
            <div className="h-full mx-2 border-l-2 border-red-400"></div>
          </div> */}

          <div className="flex w-[17%] max-[821px]:w-[49%] max-[821px]:justify-around justify-between border-r-2 min-[821px]:pr-4 max-[821px]:border-none border-red-400">
            <div
              className={`cursor-pointer select-none font-medium max-[820px]:px-1 w-[45%] p-2 rounded-md transition-all  text-center ${testType === 'word' ? 'bg-emerald-500 text-slate-900 dark:bg-lime-600 dark:text-slate-900' : ' text-slate-700 dark:bg-gray-700 dark:text-gray-300'}`}
              onClick={() => onCategoryChange('word')}
            >
              Word
            </div>
            <div
              className={`cursor-pointer select-none font-medium  max-[820px]:px-1 w-[45%] p-2 rounded-md transition-all text-center  ${testType === 'time' ? 'bg-emerald-500 text-slate-900 dark:bg-lime-600 dark:text-slate-900' : ' text-slate-700 dark:bg-gray-700 dark:text-gray-300'}`}
              onClick={() => onCategoryChange('time')}
            >
              Time
            </div>
          </div>
          <div className="max-[821px]:block w-[100%] hidden">
            <div className="h-[1px] w-[90%] mx-auto bg-slate-500"></div>
          </div>

          <div className="flex max-[860px]:w-[58%] max-[820px]:w-full w-[52%] justify-between  font-medium text-center">
            {testType === 'word' ? (
              <>
                <div
                  className={`cursor-pointer select-none p-2 w-[21%] rounded-md transition-all duration-300 ${testName === '10' ? 'bg-blue-500 text-white dark:bg-blue-600 ' : ' text-slate-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  onClick={() => handleTestName('10')}
                >
                  10 <span className='max-[470px]:block '>words</span>
                </div>
                <div
                  className={`cursor-pointer select-none p-2 w-[21%] rounded-md transition-all duration-300 ${testName === '25' ? 'bg-blue-500 text-white dark:bg-blue-600 ' : ' text-slate-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  onClick={() => handleTestName('25')}
                >
                  25 <span className='max-[470px]:block '>words</span>
                </div>
                <div
                  className={`cursor-pointer select-none p-2 w-[21%] rounded-md transition-all duration-300 ${testName === '50' ? 'bg-blue-500 text-white dark:bg-blue-600 ' : ' text-slate-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  onClick={() => handleTestName('50')}
                >
                  50 <span className='max-[470px]:block '>words</span>
                </div>
                <div
                  className={`cursor-pointer select-none p-2 w-[21%] rounded-md transition-all duration-300 ${testName === '100' ? 'bg-blue-500 text-white dark:bg-blue-600 ' : ' text-slate-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  onClick={() => handleTestName('100')}
                >
                  100 <span className='max-[470px]:block '>words</span>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`cursor-pointer p-2 w-[21%] rounded-md transition-all duration-300  ${testName === '10' ? 'bg-blue-500 text-white dark:bg-blue-600 ' : ' text-slate-700 dark:bg-gray-700 dark:text-gray-300 '
                    }`}
                  onClick={() => handleTestName('10')}
                >
                  10  <span className="max-[370px]:block">sec </span>
                </div>
                <div
                  className={`cursor-pointer p-2 w-[21%] rounded-md transition-all duration-300  ${testName === '30' ? 'bg-blue-500 text-white dark:bg-blue-600 ' : ' text-slate-700 dark:bg-gray-700 dark:text-gray-300 '
                    }`}
                  onClick={() => handleTestName('30')}
                >
                  30  <span className="max-[370px]:block">sec </span>
                </div>
                <div
                  className={`cursor-pointer p-2 w-[21%] rounded-md transition-all duration-300  ${testName === '60' ? 'bg-blue-500 text-white dark:bg-blue-600 ' : ' text-slate-700 dark:bg-gray-700 dark:text-gray-300 '
                    }`}
                  onClick={() => handleTestName('60')}
                >
                  60  <span className="max-[370px]:block">sec </span>
                </div>
                <div
                  className={`cursor-pointer p-2 w-[21%] rounded-md transition-all  duration-300 ${testName === '120' ? 'bg-blue-500 text-white dark:bg-blue-600 ' : ' text-slate-700 dark:bg-gray-700 dark:text-gray-300 '
                    }`}
                  onClick={() => handleTestName('120')}
                >
                  120  <span className="max-[370px]:block">sec </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>


  );
}
