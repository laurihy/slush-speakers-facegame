import React, { Component } from 'react';
import './App.css';
import speakers from './Speakers.js'

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getQuestion() {
  const selected = shuffleArray(speakers)
  return {
    correct: selected[0],
    answers: shuffleArray([
      speakers[0],
      speakers[1],
      speakers[2],
      speakers[3],
    ])
  }
}

const AnswerButton = function(props) {
  return (
    <button className="AnswerButton" onClick={() => {props.onAnswer(props.answerId)} }>
      <p>{props.answerName}</p>
    </button>
  );
}

const Question = function(props){
  return (
    <div className="QuestionContainer">
      <div className="PhotoContainer" style={{'backgroundImage': 'url("' + props.photoUrl + '"'}}></div>
      <div className="AnswerContainer">
        {props.answers.map(function(answer) {
          return <AnswerButton
            key={answer.id}
            answerId={answer.id}
            answerName={answer.name}
            onAnswer={props.onAnswer}
          ></AnswerButton>
        })}
      </div>
    </div>
  );
}

class App extends Component {

  state = {
    correctAnswers: 0,
    currentQuestion: getQuestion(),
    prevQuestion: {},
    view: 'question'
  }

  render() {

    var self = this;

    let onAnswer = function(answerId) {
      if (answerId === self.state.currentQuestion.correct.id) {
        self.setState({
          correctAnswers: self.state.correctAnswers + 1,
          prevQuestion: self.state.currentQuestion,
          currentQuestion: getQuestion(),
          view: 'correct'
        });
      } else {
        self.setState({
          correctAnswers: 0,
          prevQuestion: self.state.currentQuestion,
          currentQuestion: getQuestion(),
          view: 'wrong'
        });
      }
    }

    let containerClasses = ['AppContainer'];
    if (self.state.view === 'wrong') {
      containerClasses.push('WrongView');
    }
    if (self.state.view === 'correct') {
      containerClasses.push('CorrectView');
    }


    return (
      <div className={containerClasses.join(' ')}>
        <div className="CorrectAnswer">
          <div className="CardInner">
            You are right!!
            <button className="NextButton" onClick={() => {this.setState({view: 'question'})}}>Next question</button>
          </div>
        </div>

        <div className="ScoreCounter">
          {this.state.correctAnswers}
        </div>
        <Question
          onAnswer={onAnswer}
          answers={this.state.currentQuestion.answers}
          photoUrl={this.state.currentQuestion.correct.photo}
        ></Question>
      </div>
    );
  }
}

export default App;
