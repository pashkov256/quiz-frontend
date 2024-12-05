export interface Question{
    questionId: number,
    question: string,
    answerOptions: string[],
    timeSeconds?:number
    imageUrl?:string
}


export interface IQuiz {
    _id: string,
    title: string,
    questions: Question[],
    createdAt:string,
    createdBy: string,
    availableUntil?: string,
    peoplePassed: number,
}
export interface IAnswer {
    questionId: number,
    answer: string,
}
