import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase, FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const UserList = () => {
  const [state, setState] = useState({
    loading: false,
    users: [] as any[],
  });

  const firebase = useContext(FirebaseContext)!;

  useEffect(() => {
    setState({ ...state, loading: true });

    const unsubscribe = firebase.users().onSnapshot(snapshot => {
      let users: any[] = [];

      snapshot.forEach(doc =>
        users.push({ ...doc.data(), uid: doc.id }),
      );

      setState({
        users,
        loading: false,
      });
    });

    return unsubscribe();
  }, []);

  const { users, loading } = state;

  return (
    <div>
      <h2>Users</h2>
      {loading && <div>Loading ...</div>}
      <ul>
        {users.map(user => (
          <li key={user.uid}>
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
              <Link
                to={{
                  pathname: `${ROUTES.ADMIN}/${user.uid}`,
                  state: { user },
                }}
              >
                Details
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
