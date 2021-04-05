import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Machines from './components/Machines';
import Login from './components/Login';
import Play from './components/Play';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/machines">
          <Machines />
        </PrivateRoute>
        <PrivateRoute path="/play?id=:machineId">
          <Play />
        </PrivateRoute>
        <PrivateRoute path="/play">
          <Play />
        </PrivateRoute>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));