import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import _ from 'lodash';
import './App.css';
import speakers17 from './Speakers17.js';

import Question from './components/question.js'
import AnswerCard from './components/answer.js'


var ImgixClient = require('imgix-core-js');


const getQuestion = function(answers) {
  const selected = _.sampleSize(answers, 4);
  return {
    correct: selected[0],
    answers: _.shuffle(selected)
  }
};


class App extends Component {

  state = {
    correctAnswers: [],
    currentQuestion: getQuestion(speakers17),
    prevQuestion: {},
    view: 'init'
  }

  render() {

    let self = this;

    const onAnswer = function(answer) {
      const isCorrect = answer.id === self.state.currentQuestion.correct.id;
      self.setState({
          correctAnswers: isCorrect ? self.state.correctAnswers.concat([answer]) : self.state.correctAnswers,
          view: 'answer',
          wasCorrect: isCorrect,
          prevAnswerId: answer.id,
          prevQuestion: self.state.currentQuestion,
      });

      // update next question with a bit of delay
      // so animating in AnswerCard looks smoother
      setTimeout(function() {
        self.setState({
          currentQuestion: getQuestion(speakers17),
        })
      }, 250)
    }

    return (
      <div className={'AppContainer'}>
        <div className={`slider ${self.state.view === 'answer' ? 'slide-open' : ''}`}>
          <AnswerCard
            points={self.state.correctAnswers.length}
            wasCorrect={self.state.wasCorrect}
            correct={self.state.prevQuestion.correct || {}}
            next={() => {
              self.setState({view: self.state.wasCorrect ? 'question' : 'highscore'})
              setTimeout(function() {
                self.setState({
                  prevQuestion: self.state.currentQuestion
                })
              }, 250)
            }}
          ></AnswerCard>
        </div>

        <div className={'HighScore'} style={{display: self.state.view === 'highscore' ? 'flex' : 'none'}}>
          <div class="CardInner">
            <div class="correct">
              <h1>{self.state.correctAnswers.length} correct in a row</h1>
            </div>
            <div>
              {(self.state.correctAnswers || []).map((answer) => {
                return <img className='inline-thumbnail' key={answer.id} src={answer.thumbnail} />
              })}
            </div>
            <div>
              <button className="ButtonContainer NextButton" onClick={() => {self.setState({'view': 'question', correctAnswers: []})}}>
                <div className="ButtonInner NextButtonInner">
                  <p>Play again</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="ScoreCounter">
          <div>{this.state.correctAnswers.length}</div>
        </div>

        <Question
          onAnswer={onAnswer}
          answers={this.state.currentQuestion.answers}
          photoUrl={this.state.currentQuestion.correct.photo_with_border}
        ></Question>

      </div>
    );
  }
}

export default App;
