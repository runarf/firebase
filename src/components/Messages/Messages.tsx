import React, { useState, useContext, useEffect } from 'react';

import { AuthUserContext } from '../Session';
import Firebase, { withFirebase, FirebaseContext } from '../Firebase';
import MessageList from './MessageList';
import { User } from 'firebase';

export interface Message extends firebase.firestore.DocumentData {
  uid: string;
}

const Messages = () => {
  const [state, setState] = useState({
    text: '',
    loading: false,
    messages: [] as Message[] | null,
    limit: 5,
  });

  const firebase: Firebase = useContext(FirebaseContext)!;

  useEffect(() => {
    const unsubscribe = onListenForMessages();

    return unsubscribe();
  }, []);

  const onListenForMessages = () => {
    setState({ ...state, loading: true });

    const unsubscribe = firebase
      .messages()
      .orderBy('createdAt', 'desc')
      .limit(state.limit)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let messages: Message[] = [];
          snapshot.forEach(doc =>
            messages.push({ ...doc.data(), uid: doc.id }),
          );

          setState({
            ...state,
            messages: messages.reverse(),
            loading: false,
          });
        } else {
          setState({ ...state, messages: null, loading: false });
        }
      });

    return unsubscribe;
  };

  const onChangeText = (event: { target: { value: any } }) => {
    setState({ ...state, text: event.target.value });
  };

  const onCreateMessage = (
    event: React.FormEvent<HTMLFormElement>,
    authUser: User | null,
  ) => {
    firebase.messages().add({
      text: state.text,
      userId: authUser?.uid,
      createdAt: firebase.fieldValue.serverTimestamp(),
    });

    setState({ ...state, text: '' });

    event.preventDefault();
  };

  const onEditMessage = (message: Message, text: string) => {
    const { uid, ...messageSnapshot } = message;

    firebase.message(message.uid).update({
      ...messageSnapshot,
      text,
      editedAt: firebase.fieldValue.serverTimestamp(),
    });
  };

  const onRemoveMessage = (uid: any) => {
    firebase.message(uid).delete();
  };

  const onNextPage = () => {
    setState(state => ({ ...state, limit: state.limit + 5 }));
  };

  useEffect(() => {
    const unsubscribe = onListenForMessages();

    return unsubscribe();
  }, [state.limit]);

  const { text, messages, loading } = state;

  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div>
          {!loading && messages && (
            <button type="button" onClick={onNextPage}>
              More
            </button>
          )}

          {loading && <div>Loading ...</div>}

          {messages && (
            <MessageList
              authUser={authUser}
              messages={messages}
              onEditMessage={onEditMessage}
              onRemoveMessage={onRemoveMessage}
            />
          )}

          {!messages && <div>There are no messages ...</div>}

          <form onSubmit={event => onCreateMessage(event, authUser)}>
            <input type="text" value={text} onChange={onChangeText} />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

export default withFirebase(Messages);
