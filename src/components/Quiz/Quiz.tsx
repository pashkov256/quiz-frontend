import React, {useContext, useEffect, useState} from "react";
import cls from "./Quiz.module.scss";
import axios from "../../api/api";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { LuTimer } from "react-icons/lu";
import { IQuiz } from "../../model/IQuiz";
import Result from "../Result/Result";
import {useParams} from "react-router-dom";
import {SERVER_URL} from "../../const";
import {UserContext} from "../../context/UserContext";
const questionTimeSeconds = 15;

function Quiz() {
    const [quiz, setQuiz] = useState<IQuiz>({
        _id: "",
        title: "",
        questions: [],
        createdAt:"",
        createdBy:"",
        peoplePassed:0
    });
    const {quizId} = useParams<{quizId:string}>();
    const [quizIsLoading, setQuizIsLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<any[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
    const [answerStatus, setAnswerStatus] = useState<{
        correctAnswer?: string;
        selectedAnswer?: string;
    }>({});
    const [buttonsIsDisabled, setButtonsIsDisabled] = useState(false);
    const userData = useContext(UserContext);
    useEffect(() => {
        const getQuiz = async () => {
            try {
                const { data } = await axios.get<IQuiz>(
                    `${SERVER_URL}/quiz/${quizId}`
                );
                setQuiz(data || { _id: "", title: "", questions: [] });
                if(currentQuestion === 0){
                    if(data.questions[0].timeSeconds !== undefined){
                        setSecondsLeft(data.questions[0].timeSeconds )
                    }
                }
            } catch (error) {
                console.error("Failed to load quiz", error);
            } finally {
                setQuizIsLoading(false);
            }
        };

        getQuiz();
    }, []);

    useEffect(() => {
        if (secondsLeft === null) return;

        if (secondsLeft > 0) {
            const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // Время вышло
            alert("Время вышло! :(")
            setButtonsIsDisabled(true);
            setUserAnswers((prev) => [...prev, { correct: false }]);
        }
    }, [secondsLeft]);

    const startTimer = () => {
        if (Math.random() < 0.5) {
            setSecondsLeft(15);
        } else {
            setSecondsLeft(null);
        }
    };

    const handleAnswer = async (answer:any) => {
        try {
            setButtonsIsDisabled(true);

            const { data } = await axios.post(`http://localhost:3333/quiz/check`, {
                userAnswer: answer,
                quizId: quiz._id,
                questionId: currentQuestion + 1,
            });

            const { isCorrect, correctAnswer } = data;
            console.log(data)
            setAnswerStatus({
                selectedAnswer: answer,
                correctAnswer,
            });

            setUserAnswers((prev) => [
                ...prev,
                { correct: isCorrect, userAnswer: answer, correctAnswer },
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setSecondsLeft(null); // Останавливаем таймер
        }
    };

    const handleNextQuestion = async () => {
        if (currentQuestion >= quiz.questions.length - 1) {
            setIsComplete(true);
            let conuntTrueAnswer = 0
            userAnswers.forEach(element => {
                if(element.userAnswer){
                    conuntTrueAnswer += 1
                }
            });
                try {
                    await axios.post(`/quiz/${quizId}/save1`, {
                        userName:userData.fullName,
                        countAll:quiz.questions.length,
                        countUser:conuntTrueAnswer,
                    })
                }catch(error){}
        } else {
            setCurrentQuestion((prev) => prev + 1);
            setAnswerStatus({});
            setButtonsIsDisabled(false);
            if (quiz.questions[currentQuestion + 1]?.timeSeconds !== undefined) {
                //@ts-ignore
                setSecondsLeft(quiz.questions[currentQuestion + 1].timeSeconds);
            }
            startTimer();
        }
    };

    if (quizIsLoading) {
        return <div className="quiz">Загрузка...</div>;
    }

    const currentQuizQuestion = quiz.questions[currentQuestion];

    return (
        <div className={cls.quiz}>
            <div className={cls["quiz-header"]}>
                <h1 className={cls['header-title']}>Квиз на тему: {quiz.title}</h1>
            </div>

            <div className={cls["quiz-wrapper"]}>
                {isComplete ? (
                    <Result
                        result={userAnswers}
                        questionCount={quiz.questions.length}
                    >
                        complete
                    </Result>
                ) : (
                    <>
                        <div className={cls["question-text-wrapper"]}>
                            <h3 className={cls["question-text"]}>{currentQuizQuestion.question}</h3>
                        </div>

                        <div className={cls["quiz-question-count"]}>
                            <RiQuestionAnswerLine size={32} />
                            <span className={cls["question-count-text"]}>{currentQuestion + 1}</span>
                        </div>

                        {secondsLeft !== null && (
                            <div className={cls["quiz-timer"]}>
                                <span className={cls["timer-text"]}>{secondsLeft}</span>
                                <LuTimer size={32} />
                            </div>
                        )}

                        <div className={cls["quiz-questions"]}>
                            {currentQuizQuestion.answerOptions.map((el, i) => {
                                const isCorrect = el === answerStatus.correctAnswer;
                                const isSelected = el === answerStatus.selectedAnswer;

                                return (
                                    <button
                                        key={i}
                                        disabled={buttonsIsDisabled}
                                        className={`${cls["quiz-question"]} ${
                                            isSelected
                                                ? isCorrect
                                                    ? cls["correct"]
                                                    : cls["error"]
                                                : isCorrect
                                                    ? cls["correct"]
                                                    : ""
                                        }`}
                                        onClick={() => handleAnswer(el)}
                                    >
                                        {el}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            className={cls["btn-continue"]}
                            onClick={handleNextQuestion}
                        >
                            {currentQuestion >= quiz.questions.length - 1 ? "Завершить" : "Продолжить"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Quiz;
