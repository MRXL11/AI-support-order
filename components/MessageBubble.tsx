
import React from 'react';
import { type Message } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <BotIcon className="w-6 h-6 text-white"/>
        </div>
      )}
      <div
        className={`max-w-md lg:max-w-xl px-5 py-3 rounded-2xl ${
          isBot ? 'bg-gray-700 rounded-bl-lg' : 'bg-blue-600 rounded-br-lg'
        }`}
      >
        <p className="text-white whitespace-pre-wrap">{message.text}</p>
      </div>
      {!isBot && (
         <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-6 h-6 text-gray-300"/>
        </div>
      )}
    </div>
  );
};
