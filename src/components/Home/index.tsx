import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  useAuthorization,
  useEmailVerification,
  EmailVerification,
} from '../Session';
import Messages from '../Messages';
import * as ROUTES from '../../constants/routes';

const HomePage = () => {
  const authorization = useAuthorization(condition);
  const emailVerification = useEmailVerification();
  const history = useHistory();

  if (authorization.isLoading) {
    return <div>Loading...</div>;
  }

  if (!authorization.isLoggedIn) {
    history.push(ROUTES.SIGN_IN);
  }

  if (emailVerification.needsEmailVerification) {
    return <EmailVerification />;
  }

  return (
    <div>
      <h1>Home Page</h1>
      <p>The Home Page is accessible by every signed in user.</p>

      <Messages />
    </div>
  );
};

const condition = (authUser: any) => !!authUser;

export default HomePage;
