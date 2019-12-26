import React, { useContext } from 'react';
import Firebase from './firebase';

const FirebaseContext = React.createContext<Firebase | null>(null);

export const withFirebase = (Component: any) => (props: any) => {
  const firebase = useContext(FirebaseContext);
  return <Component {...props} firebase={firebase} />;
};

export default FirebaseContext;
