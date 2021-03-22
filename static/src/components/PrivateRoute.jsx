import React from 'react';
import {
    Redirect,
    Route
} from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
    const token = localStorage.getItem('token');
    return (
      <Route
        {...rest}
        render={({ location }) =>
          token ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  export default PrivateRoute;