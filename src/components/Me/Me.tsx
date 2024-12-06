import cls from './Me.module.scss';
import {UserContext} from "../../context/UserContext";
import {useContext, useEffect, useState} from "react";
import {IQuiz} from "../../model/IQuiz";
import axios from "axios";
import {QuizCardList} from "../../components/QuizCardList/QuizCardList";
import {SERVER_URL} from "../../const";

interface UserProps {
    className?: string;
}

export const Me = (props: UserProps) => {
    const { className } = props;
    const userData = useContext(UserContext);
    const userId = userData._id
    const isMe = userId === userData._id;
    const [allQuiz, setAllQuiz] = useState<IQuiz[]>([])
    const [allQuizIsLoading, setAllQuizIsLoading] = useState(true);

    useEffect(() => {
        const allQuiz = async ()=>{
            try {
                const { data } = await axios.get<{quizes:IQuiz[]}>(
                    `${SERVER_URL}/user/${userId}/quiz/all`
                );
                setAllQuiz(data.quizes);
            } catch (e) {

            } finally {
                setAllQuizIsLoading(false);
            }
        }
        allQuiz()
    }, []);
    return (
        <div className={cls.content}>

            <div className={cls.quizList}>
                <h3>{isMe ? "Ваши опросы" : "Квизы пользователя"}</h3>
            </div>
            {(!allQuizIsLoading) ? <QuizCardList quizes={allQuiz} /> : null}
        </div>
    )

};
