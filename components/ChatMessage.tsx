
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { UserIcon, BotIcon } from './Icons';

interface MarkdownRendererProps {
  text: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  const renderWithFormatting = (line: string) => {
    // This regex splits the string by **bold** and *italic* markers, keeping the delimiters.
    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const lines = text.split('\n');
  const elements = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
          {listItems.map((item, index) => (
            <li key={index}>{renderWithFormatting(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      listItems.push(line.replace(/^[-*]\s*/, ''));
    } else {
      flushList();
      if(line.trim().length > 0) {
        elements.push(<p key={`p-${elements.length}`}>{renderWithFormatting(line)}</p>);
      }
    }
  });

  flushList(); // Flush any remaining list items

  return <div className="space-y-2 text-sm md:text-base">{elements}</div>;
};


interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
          <BotIcon className="w-5 h-5" />
        </div>
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${isUser ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
        <MarkdownRenderer text={message.message} />
      </div>
       {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0">
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
