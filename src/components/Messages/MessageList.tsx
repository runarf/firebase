import React from 'react';

import MessageItem from './MessageItem';
import { User } from 'firebase';
import { Message } from './Messages';

const MessageList = ({
  authUser,
  messages,
  onEditMessage,
  onRemoveMessage,
}: {
  authUser: User | null;
  messages: Message[];
  onEditMessage: any;
  onRemoveMessage: any;
}) => (
  <ul>
    {messages.map(message => (
      <MessageItem
        authUser={authUser}
        key={message.uid}
        message={message}
        onEditMessage={onEditMessage}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </ul>
);

export default MessageList;
