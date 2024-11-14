export interface Question{
    questionId: number,
    question: string,
    answerOptions: string[],
    timeSeconds:number
}


export interface IQuiz {
    id: number,
    title: string,
    questions: Question[]
}