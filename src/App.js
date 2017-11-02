import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import speakers from './Speakers.js';

const correctAnswerMessages = [
  'That\'s right!',
  'You are correct!',
  'Great job!',
  'It\'s #agoodstart!',
  'Rock\'n\'roll!',
  'Ihan ok.',
  'Aww Yiss!',
  'Yes!'
];

const wrongAnswerMessages = [
  'Nope :(',
  'Hyvä #oppimiskokemus',
  'Not quite right :(',
  'Don\'t you know who I am?',
  'D\'oh',
  'Wrong :('
];

const highlightThresholds = [{
    limit: 7,
    message: 'Already 7 correct in a row, #agoodstart',
    class: 'first-threshold'
  }, {
    limit: 15,
    message: 'You\'re on fire! 15 in a row already, nice.',
    class: 'second-threshold'
  }, {
    limit: 24,
    message: '24 correct answers, amazing!',
    class: 'third-threshold'
  }, {
    limit: 50,
    message: 'Wow, you really know this stuff. Congrats! 50 correct answers.',
    class: 'fourth-threshold'
  }
];

const getQuestion = function(answers) {
  const selected = _.sampleSize(answers, 4);
  return {
    correct: selected[0],
    answers: _.shuffle(selected)
  }
};

const getMaxThreshold = function(points) {
  return (_(highlightThresholds)
          .filter((threshold) => {
            return threshold.limit <= points;
          })
          .sort(['limit'])
          .last() || {})
};

const NextButton = function(props) {
  return (
    <button className="ButtonContainer NextButton" onClick={props.next}>
      <div className="ButtonInner NextButtonInner">
        <p>Next question</p>
      </div>
    </button>
  )
}

const AnswerButton = function(props) {
  return (
    <button className="ButtonContainer AnswerButton" onClick={() => {props.onAnswer(props.answerId)} }>
      <div className="ButtonInner AnswerButtonInner">
        <p>{props.answerName}</p>
      </div>
    </button>
  );
}

const AnswerCard = function(props) {
  const threshold = _.find(highlightThresholds, {limit: props.points});
  const message = threshold ?
                    (<div className="highlight">{threshold.message}</div>) :
                    (<h2>{props.greeting}</h2>);
  return (
    <div className={'AnswerCard ' + props.type}>
      <div className='CardInner'>
        {message}
        <img className="CardPhoto" src={props.correct.photo}></img>
        <h1>{props.correct.name}</h1>
        <p>{props.correct.short_description}</p>
        {(props.correct.talks || []).map((talk) => {
          return <p key={props.correct.id + talk.date + talk.title}><strong>{talk.date}</strong> {talk.title}</p>
        })}
        <NextButton next={props.next}></NextButton>
      </div>
    </div>
  )
}

const Question = function(props){
  return (
    <div className="QuestionContainer">
      <div className="PhotoContainer" style={{'backgroundImage': 'url("' + props.photoUrl + '")'}}></div>
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
          view: isCorrect ? 'correct' : 'wrong',
          prevQuestion: self.state.currentQuestion,
          currentQuestion: getQuestion(speakers),
      });
    }

    const viewStateClasses = {
      'init': '',
      'question': 'QuestionView',
      'correct': 'AnswerView',
      'wrong': 'AnswerView'
    }

    let maxThresholdClass = getMaxThreshold(self.state.correctAnswers).class || '';
    let viewStateClass = viewStateClasses[self.state.view] || ''

    return (
      <div className={['AppContainer', maxThresholdClass, viewStateClass].join(' ')}>

        <AnswerCard
          type={self.state.view}
          points={self.state.correctAnswers}
          greeting={_.sample((self.state.view === 'correct') ? correctAnswerMessages : wrongAnswerMessages)}
          correct={self.state.prevQuestion.correct || {}}
          next={() => { self.setState({view: 'question'})}}
        ></AnswerCard>

        <div className="ScoreCounter">
          <div>{this.state.correctAnswers}</div>
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
