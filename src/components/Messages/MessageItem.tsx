import React, { useState } from 'react';
import { Message } from './Messages';
import { User } from 'firebase';

const MessageItem: React.FC<{
  message: Message;
  authUser: User | null;
  onRemoveMessage: any;
  onEditMessage: any;
}> = ({ message, authUser, onRemoveMessage, onEditMessage }) => {
  const [state, setState] = useState({
    editMode: false,
    editText: message.text,
  });

  const onToggleEditMode = () => {
    setState(state => ({
      editMode: !state.editMode,
      editText: message.text,
    }));
  };

  const onChangeEditText = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setState({ ...state, editText: event.target.value });
  };

  const onSaveEditText = () => {
    onEditMessage(message, state.editText);

    setState({ ...state, editMode: false });
  };

  const { editMode, editText } = state;

  return (
    <li>
      {editMode ? (
        <input
          type="text"
          value={editText}
          onChange={onChangeEditText}
        />
      ) : (
        <span>
          <strong>{message.userId}</strong> {message.text}
          {message.editedAt && <span>(Edited)</span>}
        </span>
      )}

      {authUser?.uid === message.userId && (
        <span>
          {editMode ? (
            <span>
              <button onClick={onSaveEditText}>Save</button>
              <button onClick={onToggleEditMode}>Reset</button>
            </span>
          ) : (
            <button onClick={onToggleEditMode}>Edit</button>
          )}

          {!editMode && (
            <button
              type="button"
              onClick={() => onRemoveMessage(message.uid)}
            >
              Delete
            </button>
          )}
        </span>
      )}
    </li>
  );
};

export default MessageItem;
