import React, { Component, useState, useContext } from 'react';
import { Link, withRouter, useHistory } from 'react-router-dom';

import Firebase, { withFirebase, FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const SignUpFormBase = () => {
  const [state, setState] = useState<any>({ ...INITIAL_STATE });
  const firebase = useContext(FirebaseContext)! as Firebase;
  const history = useHistory();
  const onSubmit = async (event: { preventDefault: () => void }) => {
    const { username, email, passwordOne, isAdmin } = state;
    const roles: any = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }
    try {
      const authUser = await firebase.doCreateUserWithEmailAndPassword(
        email,
        passwordOne,
      );
      await firebase.user(authUser.user?.uid).set(
        {
          username,
          email,
          roles,
        },
        { merge: true },
      );

      await firebase.doSendEmailVerification();

      setState({ ...INITIAL_STATE });
      history.push(ROUTES.HOME);
    } catch (error) {
      if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }

      setState({ error });
    }

    event.preventDefault();
  };

  const onChange = (event: any) => {
    setState({ [event.target.name]: event.target.value });
  };

  const onChangeCheckbox = (event: any) => {
    setState({ [event.target.name]: event.target.checked });
  };

  const {
    username,
    email,
    passwordOne,
    passwordTwo,
    isAdmin,
    error,
  } = state;

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '';

  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={username}
        onChange={onChange}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
      />
      <label>
        Admin:
        <input
          name="isAdmin"
          type="checkbox"
          checked={isAdmin}
          onChange={onChangeCheckbox}
        />
      </label>
      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = SignUpFormBase;

export default SignUpPage;

export { SignUpForm, SignUpLink };
