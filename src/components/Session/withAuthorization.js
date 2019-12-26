import React, { useReducer, useContext, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase, FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: false };
    case 'LOGGED_IN':
      return { ...state, isLoggedIn: true };
    default:
      return state;
  }
};

const initialState = {
  isLoading: true,
  isLoggedIn: false,
};

export const useAuthorization = condition => {
  const firebase = useContext(FirebaseContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const listener = firebase.onAuthUserListener(
      authUser => {
        if (condition(authUser)) {
          dispatch({ type: 'LOGGED_IN', payload: true });
        }
        dispatch({ type: 'LOADING' });
      },
      () => dispatch({ type: 'LOADING' }),
    );

    listener();
  });

  return state;
};

const withAuthorization = condition => Component => {
  const WithAuthorization = () => {
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    useEffect(() => {
      const listener = firebase.onAuthUserListener(
        authUser => {
          if (!condition(authUser)) {
            history.push(ROUTES.SIGN_IN);
          }
        },
        () => history.push(ROUTES.SIGN_IN),
      );
      listener();
    }, []);

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          condition(authUser) ? <Component {...this.props} /> : null
        }
      </AuthUserContext.Consumer>
    );
  };

  return WithAuthorization;
};

export default withAuthorization;
