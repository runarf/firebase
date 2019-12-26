import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import Firebase, { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <SignInGoogle />
    <SignInFacebook />
    <SignInTwitter />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

interface State {
  email: string;
  password: string;
  error: {
    message: string;
  } | null;
}

const INITIAL_STATE: State = {
  email: '',
  password: '',
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

const SignInForm = () => {
  const [state, setState] = useState({ ...INITIAL_STATE });
  const firebase: Firebase = useContext(FirebaseContext)!;
  const history = useHistory();

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    const { email, password } = state;
    try {
      await firebase.doSignInWithEmailAndPassword(email, password);

      setState({ ...INITIAL_STATE });
      history.push(ROUTES.HOME);
    } catch (error) {
      setState({ ...state, error });
    }

    event.preventDefault();
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { email, password, error } = state;

  const isInvalid = password === '' || email === '';

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInGoogle = () => {
  const [state, setState] = useState({ ...INITIAL_STATE });
  const firebase: Firebase = useContext(FirebaseContext)!;
  const history = useHistory();

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      const socialAuthUser = await firebase.doSignInWithGoogle();
      // Create a user in your Firebase Realtime Database too
      await firebase.user(socialAuthUser.user?.uid).set(
        {
          username: socialAuthUser.user?.displayName,
          email: socialAuthUser.user?.email,
          roles: {},
        },
        { merge: true },
      );

      setState({ ...state, error: null });
      history.push(ROUTES.HOME);
    } catch (error) {
      if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }

      setState({ ...state, error });
    }

    event.preventDefault();
  };

  const { error } = state;

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Google</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInFacebook = () => {
  const [state, setState] = useState({ ...INITIAL_STATE });
  const firebase: Firebase = useContext(FirebaseContext)!;
  const history = useHistory();

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      const socialAuthUser = await firebase.doSignInWithFacebook();
      // Create a user in your Firebase Realtime Database too
      const { name: username, email } = socialAuthUser
        .additionalUserInfo?.profile as any;
      await firebase.user(socialAuthUser.user?.uid).set(
        {
          username,
          email,
          roles: {},
        },
        { merge: true },
      );

      setState({ ...state, error: null });
      history.push(ROUTES.HOME);
    } catch (error) {
      if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }

      setState({ ...state, error });
    }

    event.preventDefault();
  };

  const { error } = state;

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Facebook</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInTwitter = () => {
  const [state, setState] = useState({ ...INITIAL_STATE });
  const firebase: Firebase = useContext(FirebaseContext)!;
  const history = useHistory();

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      const socialAuthUser = await firebase.doSignInWithTwitter();

      const { name: username, email } = socialAuthUser
        .additionalUserInfo?.profile as any;
      // Create a user in your Firebase Realtime Database too
      await firebase.user(socialAuthUser.user?.uid).set(
        {
          username,
          email,
          roles: {},
        },
        { merge: true },
      );
      setState({ ...state, error: null });
      history.push(ROUTES.HOME);
    } catch (error) {
      if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }

      setState({ ...state, error });
    }

    event.preventDefault();
  };

  const { error } = state;

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Twitter</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };
