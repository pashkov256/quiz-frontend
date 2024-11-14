const fs = require("fs");
const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();

const router = jsonServer.router(path.resolve(__dirname, "db.json"));

server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

server.post("/quize/:quizeId/question/:questionId", (req, res) => {
  try {
    console.log( req.body.userAnswer)
    const userAnswer = req.body.userAnswer
    const {quizeId,questionId} = req.params
    const db = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "db.json"), "UTF-8")
    );
  
    const quiz = db.answersQuizes.find((el)=>el.quizeId == quizeId)
   

    const answer = quiz.answers.find((el)=> el.questionId == questionId)
     console.log(answer)
    if(answer.answer === userAnswer){
        return res.status(200).json({ userAnswer: true,answer: answer.answer});
    } else {
        return res.status(200).json({ userAnswer: false,answer: answer.answer});
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

server.get("/quize/:quizeId", (req, res) => {
    try {

      const {quizeId} = req.params
      const db = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "db.json"), "UTF-8")
      );
    
      const quiz = db.quizes.find((el)=>el.id == quizeId)
     
      return res.status(200).json(quiz);
     
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  });

server.use(router);
server.listen(8000, () => {
  console.log("server is running on 8000 port");
});