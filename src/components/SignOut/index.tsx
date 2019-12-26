import React, { useContext } from 'react';

import Firebase, { FirebaseContext } from '../Firebase';

const SignOutButton = () => {
  const firebase: Firebase = useContext(FirebaseContext)!;
  return (
    <button type="button" onClick={firebase.doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
