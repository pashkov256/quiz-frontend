import React, { useEffect, useState } from "react";
import "./Quiz.scss";
import axios from "axios";
import { log } from "console";
import { IQuiz } from "../../model/IQuiz";
import QuizList from "../QuizList/QuizList";
import { Question } from "../../model/IQuiz";
import Result from "../Result/Result";
import { LuTimer } from "react-icons/lu";
import { RiQuestionAnswerLine } from "react-icons/ri";
//@ts-ignore

//QUIZ PROVERKA

const questionTimeSeconds = 15;

function Quiz() {
  const [quiz, setQuiz] = useState<IQuiz>();
  const [quizIsLoading, setQuizIsLoading] = useState(true);
  const [answerIsLoading, setAnswerIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [selectAnswerIndex, setSelectAnswerIndex] = useState<number>();
  const [timerIsActive, setTimerIsActive] = useState(true);
  const [buttonsIsDisabled, setButtonsIsDisabled] = useState(false);
  const [timerIsKill, setTimerIsKill] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(questionTimeSeconds);
  useEffect(() => {
    const getQuiz = async () => {
      try {
        const { data } = await axios.get<IQuiz>(
          "http://localhost:8000/quize/1"
        );
        setQuiz(data);
      } catch (error) {
      } finally {
        setQuizIsLoading(false);
      }
    };

    getQuiz();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerIsActive && secondsLeft > 0 && !isComplete) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      console.log("TIMER FINAL");

      if (!timerIsKill) {
        //@ts-ignore
        setUserAnswers((prev) => [...prev, { userAnswer: false }]);
        setButtonsIsDisabled(true);
      }
    }

    return () => {
      console.log(3424324324);
      clearInterval(timer);
    };
  }, [timerIsActive, secondsLeft]);

  console.log(selectAnswerIndex);
  console.log(userAnswers);
  let quizContent = null;

  if (!quizIsLoading) {
    quizContent = (
      <>
        <div className="quiz-header">
          <h1 className="header-title">Квиз на тему: {quiz?.title}</h1>
        </div>

        <div className="quiz-wrapper">
          <div className="quiz-progress">
            <div className="quiz-progress-left"></div>
            <div className="quiz-progress-right"></div>
          </div>

          {!isComplete && (
            <div className="question-text-wrapper">
              <h3 className="question-text">
                {quiz?.questions[currentQuestion].question}
              </h3>

              {buttonsIsDisabled && <span className="timeIsLeftError">Время вышло</span>}
            </div>
          )}

          {quiz !== undefined ? (
            isComplete ? (
              <Result
                result={userAnswers}
                questionCount={quiz.questions.length}
              >
                complete
              </Result>
            ) : (
              <>
       
                <div className="quiz-question-count">
                <RiQuestionAnswerLine size={32}/>
                <span className="question-count-text">{currentQuestion + 1}</span>
                </div>
                <div className="quiz-timer">
                  <span className="timer-text">{secondsLeft}</span>
                  <LuTimer size={32} />
                </div>

       

                <div className="quiz-questions">
                  {quiz.questions[currentQuestion].answerOptions.map(
                    (el, i) => {
                      let cls = "";
                      let isVoted = false;
                      if (answerIsLoading !== true) {
                        if (selectAnswerIndex !== undefined) {
                          if (userAnswers[currentQuestion]) {
                            isVoted = true;
                            if (userAnswers[currentQuestion]["answer"] === el) {
                              cls = "true";
                            } else {
                              if (selectAnswerIndex == i) {
                                cls = "error";
                              }
                            }
                          }
                        }
                      }
                      return (
                        <button
                          disabled={isVoted || buttonsIsDisabled}
                          className={`quiz-question ${cls}`}
                          onClick={async () => {
                            setSelectAnswerIndex(i);
                            try {
                              setAnswerIsLoading(true);
                              const { data } = await axios.post(
                                `http://localhost:8000/quize/${
                                  quiz.id
                                }/question/${currentQuestion + 1}`,
                                { userAnswer: el }
                              );
                              console.log(data);

                              //@ts-ignore
                              setUserAnswers((prev) => [...prev, data]);
                              setAnswerIsLoading(false);
                              setTimerIsKill(true);
                              setSecondsLeft(0);
                              setButtonsIsDisabled(false);
                            } catch {}
                          }}
                        >
                          {el}
                        </button>
                      );
                    }
                  )}
                </div>
                {quiz?.questions !== undefined
                  ? currentQuestion <= quiz.questions.length - 1 && (
                      <button
                        className="btn-continue"
                        onClick={() => {
                          if (currentQuestion >= quiz.questions.length - 1) {
                            setIsComplete(true);
                          } else {
                            setTimerIsKill(false);
                            setCurrentQuestion(currentQuestion + 1);
                            setSecondsLeft(questionTimeSeconds);
                            setButtonsIsDisabled(false);
                            setSelectAnswerIndex(undefined);
                          }
                        }}
                      >
                        {currentQuestion >= quiz.questions.length - 1
                          ? "Завершить"
                          : "Продолжить"}
                      </button>
                    )
                  : null}
              </>
            )
          ) : (
            ""
          )}
        </div>
      </>
    );
  } else {
    quizContent = <div className="quiz"></div>;
  }

  return <div className="quiz">{quizContent}</div>;
}

export default Quiz;
