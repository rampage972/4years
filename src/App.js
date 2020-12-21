import React, { Component } from 'react'
import Lottery from './Lottery'
import Login from './Login'
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
const hist = createBrowserHistory();
export default class App extends Component {
  render() {
    return (
      <div>
        <Router history={hist}>
          <Switch>
            <Route exact path="/login" render={props => <Login {...props} />} />
            <Route exact path="/lottery" render={props => <Lottery {...props} />} />
            {/* <Route path="/user-manager/:userID" render={props => <UserManager {...props} />} /> */}
            {/* <Route path="/governance" render={props => <DataGovernance {...props} />} />
                        <Route path="/tool" render={props => <Tool {...props} />} /> */}
            <Redirect  exact from="/" to="/login" /> 
          </Switch>
        </Router>
      </div>
    )
  }
}
