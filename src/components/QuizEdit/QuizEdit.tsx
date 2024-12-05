// eslint-disable-file
import {
    Box, Container, Tab, Tabs,
} from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from '../../api/api';
import { SERVER_URL } from '../../const';
import cls from './QuizEdit.module.scss';
import { QuizForm } from '../QuizForm/QuizForm';
import { IAnswer, IQuiz } from '../../model/IQuiz';

{ /* eslint-disable-next-line react/button-has-type */ }

interface QuizCreateProps {
}

function TabPanel(props:any) {
    const {
        children, value, index, ...other
    } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

interface UserHistory {
    userId:string,
    userName:string,
    countAll:number,
    countUser:number,
}

export const QuizEdit = (props: QuizCreateProps) => {
    const [value, setValue] = useState(0);
    const { quizId } = useParams();
    const isCreateMode = quizId === undefined;
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState<IQuiz>({
        _id: '',
        title: '',
        questions: [],
        createdAt: '',
        createdBy: '',
        peoplePassed: 0,
    });
    const [quizResults,setQuizResults] = useState([])
    const [answersData, setAnswersData] = useState<IAnswer[]>([]);
    const [quizDataIsLoading, setQuizDataIsLoading] = useState(!isCreateMode);
    const [quizResultsIsLoading, setQuizResultsIsLoading] = useState(!isCreateMode);
    const handleChange = (event: SyntheticEvent, newValue:any) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (!isCreateMode) {
            const getQuizById = async () => {
                try {
                    const { data } = await axios.get<{quiz:IQuiz, answers:any}>(
                        `${SERVER_URL}/quiz/${quizId}/form`,
                    );
                    setQuizData(data.quiz);
                    setAnswersData(data.answers);
                } catch (e) {
                    alert(e);
                } finally {
                    setQuizDataIsLoading(false);
                }
            };
            const getQuizResults = async () => {
                try {
                    const { data } = await axios.get<{quizId:string,quizResults:UserHistory[]}[]>(
                        `${SERVER_URL}/quiz/${quizId}/results`
                    );

                    console.log(data)
                    //@ts-ignore
                    setQuizResults(data);
                } catch (e) {
                    alert(e);
                } finally {
                    setQuizResultsIsLoading(false);
                }
            };
            getQuizById();
            getQuizResults()
        }
    }, [quizId, isCreateMode]);

    // @ts-ignore
    // @ts-ignore
    return (
        <div className={cls.QuizCreate}>
            <div className={cls.tabPanels}>
                <Container maxWidth="lg" className={cls.tabPanelsContent}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Вопросы" />
                        <Tab label="Ответы" />
                    </Tabs>
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button
                        className={cls.BtnSaveForm}
                        onClick={async () => {
                            if (isCreateMode) {
                                console.log({
                                    quiz: quizData,
                                    answers: answersData,
                                });
                                try {
                                    await axios.post(
                                        `${SERVER_URL}/quiz/create`,
                                        // eslint-disable-next-line
                                        {
                                            title: quizData.title,
                                            questions: quizData.questions,
                                            answers: answersData,
                                        },
                                    );
                                    alert("Успешно сохранено")
                                } catch (e) {
                                    alert(e);
                                }
                                navigate(`/`);
                            } else {

                                try {
                                    await axios.post(
                                        `${SERVER_URL}/quiz/${quizId}/save`,
                                        {
                                            title: quizData.title,
                                            questions: quizData.questions,
                                            answers: answersData,
                                        },
                                    );
                                    alert("Успешно сохранено")
                                    navigate(`/quiz/${quizId}/edit`);
                                } catch (e) {
                                    alert(e);
                                }
                            }


                        }}
                    >
                        Сохранить опрос
                    </button>
                </Container>

            </div>

            <div className={cls.QuizContainer}>
                {!quizDataIsLoading && (
                    <TabPanel value={value} index={0}>
                        <QuizForm
                            quizData={quizData}
                            answersData={answersData}
                            onChangeQuizData={setQuizData}
                            onChangeAnswerData={setAnswersData}
                        />
                    </TabPanel>
                )}
                  <TabPanel value={value} index={1}>
                      sdfsdf
                      {console.log(quizResultsIsLoading)}
                      {!quizResultsIsLoading && <table>
                        <thead>
                        <tr>
                            <th>Имя пользователя</th>
                            <th>Правильных вопросов</th>
                        </tr>
                        </thead>
                        <tbody>

                       
                        </tbody>
                    </table>
                      }
                </TabPanel>

            </div>

        </div>
    );
};
