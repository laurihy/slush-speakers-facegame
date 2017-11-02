import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import _ from 'lodash';
import './App.css';
import speakers from './Speakers.js';

import Question from './components/question.js'
import AnswerCard from './components/answer.js'


const getQuestion = function(answers) {
  const selected = _.sampleSize(answers, 4);
  return {
    correct: selected[0],
    answers: _.shuffle(selected)
  }
};


class App extends Component {

  state = {
    correctAnswers: 0,
    currentQuestion: getQuestion(speakers),
    prevQuestion: {},
    view: 'init'
  }

  render() {

    let self = this;

    const onAnswer = function(answerId) {
      const isCorrect = answerId === self.state.currentQuestion.correct.id;
      self.setState({
          correctAnswers: isCorrect ? self.state.correctAnswers + 1 : 0,
          view: 'answer',
          wasCorrect: isCorrect,
          prevAnswerId: answerId,
          prevQuestion: self.state.currentQuestion,
      });

      // update next question with a bit of delay
      // so animating in AnswerCard looks smoother
      setTimeout(function() {
        self.setState({
          currentQuestion: getQuestion(speakers),
        })
      }, 250)
    }

    return (
      <div className={'AppContainer'}>
        <div className={`slider ${self.state.view === 'answer' ? 'slide-open' : ''}`}>
          <AnswerCard
            points={self.state.correctAnswers}
            wasCorrect={self.state.wasCorrect}
            correct={self.state.prevQuestion.correct || {}}
            next={() => { self.setState({view: 'question'})}}
          ></AnswerCard>
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
