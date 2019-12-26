import React, { useState, useEffect, useContext } from 'react';

import { FirebaseContext } from '../Firebase';

const UserItem = (props: any) => {
  const firebase = useContext(FirebaseContext)!;
  const [state, setState] = useState({
    loading: false,
    user: null,
    ...props.location.state,
  });

  useEffect(() => {
    if (state.user) {
      return;
    }

    setState({ ...state, loading: true });

    const unsubscribe = firebase
      .user(props.match.params.id)
      .onSnapshot(snapshot => {
        setState({
          user: snapshot.data(),
          loading: false,
        });
      });

    return unsubscribe();
  }, []);

  const onSendPasswordResetEmail = () => {
    firebase.doPasswordReset(state.user.email);
  };

  const { user, loading } = state;

  return (
    <div>
      <h2>User ({props.match.params.id})</h2>
      {loading && <div>Loading ...</div>}

      {user && (
        <div>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
          <span>
            <button type="button" onClick={onSendPasswordResetEmail}>
              Send Password Reset
            </button>
          </span>
        </div>
      )}
    </div>
  );
};

export default UserItem;
