import React, { Component } from 'react';

const AnswerButton = function(props) {
  return (
    <button className="ButtonContainer AnswerButton" onClick={() => {props.onAnswer(props.answer)} }>
      <div className="ButtonInner AnswerButtonInner">
        <p>{props.answerName}</p>
      </div>
    </button>
  );
}

const Question = function(props){
  return (
    <div className="QuestionContainer">
      <div className="PhotoContainer" style={{'backgroundImage': 'url("' + props.photoUrl + '")'}}></div>
      <div className="AnswerContainer">
        {props.answers.map(function(answer) {
          return <AnswerButton
            key={answer.id}
            answerId={answer}
            answer={answer}
            answerName={answer.name}
            onAnswer={props.onAnswer}
          ></AnswerButton>
        })}
      </div>
    </div>
  );
}

export default Question;