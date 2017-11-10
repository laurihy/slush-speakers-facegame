import React, { Component } from 'react';
import _ from 'lodash';

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

const NextButton = function(props) {
  return (
    <button className="ButtonContainer NextButton" onClick={props.next}>
      <div className="ButtonInner NextButtonInner">
        <p>Next question</p>
      </div>
    </button>
  )
}

const AnswerCard = function(props) {
  const threshold = _.find(highlightThresholds, {limit: props.points});
  const message = (threshold && props.wasCorrect) ?
                    (<div className="highlight">{threshold.message}</div>) :
                    (<h2>{_.sample(props.wasCorrect ? correctAnswerMessages : wrongAnswerMessages)}</h2>);
  return (
    <div className={`AnswerCard ${props.wasCorrect ? 'correct' : 'wrong'}`}>
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

export default AnswerCard;