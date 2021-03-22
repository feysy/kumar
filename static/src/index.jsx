import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Machines from './components/Machines';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/machines">
          <Machines />
        </PrivateRoute>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));