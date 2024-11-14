import React, { useEffect, useState } from "react";
import './Result.scss'

function Result({result,questionCount}:any) {
       
    let conuntTrueAnswer = 0
//@ts-ignore
    result.forEach(element => {
        if(element.userAnswer){
            conuntTrueAnswer += 1
        }
    });

  

  return (
    <div className="result-wrapper">
        <span className="result-text">Правильных ответов <br/> {conuntTrueAnswer} из {questionCount}</span>
    </div>
  );
}

export default Result;
