import React, { useState, useContext, useEffect } from 'react';

import AuthUserContext from './context';
import Firebase, { withFirebase, FirebaseContext } from '../Firebase';
import { User } from 'firebase';

const doNeedsEmailVerification = (authUser: User | null): boolean => {
  const needs =
    !authUser?.emailVerified &&
    authUser?.providerData
      .map(provider => provider?.providerId)
      .includes('password');

  return needs === undefined ? true : needs;
};

export const useEmailVerification = () => {
  const authUser: User | null = useContext(AuthUserContext);

  const [
    needsEmailVerification,
    setNeedsEmailVerification,
  ] = useState<boolean | null>(null);

  useEffect(() => {
    const newNeedsEmailVerification: boolean = doNeedsEmailVerification(
      authUser,
    );
    setNeedsEmailVerification(newNeedsEmailVerification);
  });

  return { needsEmailVerification };
};

export const EmailVerification = () => {
  const [isSent, setIsSent] = useState(false);
  const firebase = useContext(FirebaseContext)! as Firebase;
  const onSendEmailVerification = async () => {
    await firebase.doSendEmailVerification()!;
    setIsSent(true);
  };

  return (
    <div>
      {isSent ? (
        <p>
          E-Mail confirmation sent: Check you E-Mails (Spam folder
          included) for a confirmation E-Mail. Refresh this page once
          you confirmed your E-Mail.
        </p>
      ) : (
        <p>
          Verify your E-Mail: Check you E-Mails (Spam folder included)
          for a confirmation E-Mail or send another confirmation
          E-Mail.
        </p>
      )}

      <button
        type="button"
        onClick={onSendEmailVerification}
        disabled={isSent}
      >
        Send confirmation E-Mail
      </button>
    </div>
  );
};

const withEmailVerification = (Component: any) => {
  class WithEmailVerification extends React.Component<
    { firebase: Firebase },
    { isSent: boolean }
  > {
    constructor(props: any) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()!
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {(authUser: any) =>
            doNeedsEmailVerification(authUser) ? (
              <div>
                {this.state.isSent ? (
                  <p>
                    E-Mail confirmation sent: Check you E-Mails (Spam
                    folder included) for a confirmation E-Mail.
                    Refresh this page once you confirmed your E-Mail.
                  </p>
                ) : (
                  <p>
                    Verify your E-Mail: Check you E-Mails (Spam folder
                    included) for a confirmation E-Mail or send
                    another confirmation E-Mail.
                  </p>
                )}

                <button
                  type="button"
                  onClick={this.onSendEmailVerification}
                  disabled={this.state.isSent}
                >
                  Send confirmation E-Mail
                </button>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
