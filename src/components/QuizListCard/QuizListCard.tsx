import cls from './QuizListCard.module.scss';
import { IQuiz } from "../../model/IQuiz";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiShareForwardLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import {CLIENT_PROD_URL, SERVER_URL} from "../../const";
import axios from "../../api/api";
interface QuizCardProps {
    className?: string;
    quiz: IQuiz;
}

export const QuizListCard = (props: QuizCardProps) => {
    const { className, quiz } = props;
    const navigate = useNavigate();

    return (
        <Link className={cls.Card} to={`/quiz/${quiz._id}/edit`}>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Тема:</span>
                <span className={cls.CardItemData}>{quiz.title}</span>
            </div>
            <div className={cls.CardIcons}>
                <RiDeleteBinLine className={cls.CardIcon} onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation()
                    try {
                        await axios.delete(`${SERVER_URL}/quiz/${quiz._id}/delete`);
                    } catch (e) {
                        console.log(e)
                    }
                }}/>
                <RiShareForwardLine className={cls.CardIcon} onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation(); // Останавливаем всплытие события
                    navigator.clipboard.writeText(`${CLIENT_PROD_URL}/quiz/${quiz._id}`);
                    alert('Ссылка скопирована');
                }}/>
            </div>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Количество вопросов:</span>
                <span className={cls.CardItemData}>{quiz.questions.length}</span>
            </div>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Создано:</span>
                <span className={cls.CardItemData}>{quiz.createdAt}</span>
            </div>
            {quiz?.availableUntil && <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Открыт до:</span>
                <span className={cls.CardItemData}>{quiz.createdAt}</span>
            </div>}


            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Людей прошло:</span>
                <span className={cls.CardItemData}>{quiz.peoplePassed}</span>
            </div>
            <div className={cls.CardItem}>
                <span className={cls.CardItemTitle}>Открыт:</span>
                <span className={cls.CardItemData}>{true ? 'Да' : 'Нет'}</span>
            </div>
        </Link>
    );
};
