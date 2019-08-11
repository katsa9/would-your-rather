import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { handleInitialData } from '../actions/shared'
import LoadingBar from 'react-redux-loading'
import QuestionList from './QuestionList'
import Login from './Login'
import TopNav from './Nav'

class App extends Component {
  //authed user is being overridden on resfresh- use local storage
  componentDidMount () {
    this.props.dispatch(handleInitialData())
  }

  state = {
    showAnswered: false
  }

  showAnsweredQuestions = () => {
    this.setState({showAnswered: true})
  }

  showUnAnsweredQuestions = () => {
    this.setState({showAnswered: false})
  }

  render () {
    return (
      <Fragment>
        <LoadingBar />
        <div>
          {this.props.authedUser
            ? <div className="center">
              <TopNav />
              {/* <div className="text-center"> */}
                <div className="col-md-5 btn-group text-center" role="group" data-toggle="button">
                  <button onClick={this.showUnAnsweredQuestions}
                  type="button" className="my-2 btn btn-secondary" active>
                    Unanswered Questions</button>
                  <button onClick={this.showAnsweredQuestions}
                  type="button" className="my-2 btn btn-secondary">
                    Answered Questions</button>
                </div>
              {this.state.showAnswered ?
                <QuestionList 
                questions={this.props.answered}/>
                : <QuestionList 
                questions={this.props.unanswered}/>
              }
            </div>
            : <Login />}
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps ({ authedUser, questions }) {
  //filter out questions that have been answered
  const answered = Object.keys(questions)
  .filter((q) => (questions[q].optionOne.votes.includes(authedUser) || questions[q].optionTwo.votes.includes(authedUser)))
  .sort((a, b) => questions[b].timestamp - questions[a].timestamp)

  const unanswered = Object.keys(questions)
  .filter((q) => (!questions[q].optionOne.votes.includes(authedUser) && !questions[q].optionTwo.votes.includes(authedUser)))
  .sort((a, b) => questions[b].timestamp - questions[a].timestamp)

  return {
    authedUser,
    answered,
    unanswered
  }
}

export default connect(mapStateToProps)(App)
