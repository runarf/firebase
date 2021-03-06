import React, { useState, useEffect, useContext } from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import FirebaseContext from '../Firebase/context';

export const useAuthentication = () => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem('authUser')),
  );

  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    const listener = firebase.onAuthUserListener(
      authUser => {
        localStorage.setItem('authUser', JSON.stringify(authUser));
        setAuthUser(authUser);
      },
      () => {
        localStorage.removeItem('authUser');
        setAuthUser(null);
      },
    );

    return listener();
  });

  return { authUser };
};

// const withAuthentication = Component => {
//   class WithAuthentication extends React.Component {
//     constructor(props) {
//       super(props);

//       this.state = {
//         authUser: JSON.parse(localStorage.getItem('authUser')),
//       };
//     }

//     componentDidMount() {
//       this.listener = this.props.firebase.onAuthUserListener(
//         authUser => {
//           localStorage.setItem('authUser', JSON.stringify(authUser));
//           this.setState({ authUser });
//         },
//         () => {
//           localStorage.removeItem('authUser');
//           this.setState({ authUser: null });
//         },
//       );
//     }

//     componentWillUnmount() {
//       this.listener();
//     }

//     render() {
//       return (
//         <AuthUserContext.Provider value={this.state.authUser}>
//           <Component {...this.props} />
//         </AuthUserContext.Provider>
//       );
//     }
//   }

//   return withFirebase(WithAuthentication);
// };

export default withAuthentication;
