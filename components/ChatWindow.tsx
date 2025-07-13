
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sendMessage, initChat } from '../services/geminiService';
import { type Message, type OrderDetails } from '../types';
import { MessageBubble } from './MessageBubble';
import { SendIcon } from './icons/SendIcon';

interface ChatWindowProps {
  onOrderConfirmed: (details: OrderDetails) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onOrderConfirmed }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatSessionRef = useRef<any>(null); // Using `any` for the chat session object from the SDK
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = useCallback(async () => {
    try {
      const { chat, initialMessage } = await initChat();
      chatSessionRef.current = chat;
      setMessages([{ id: 'init', text: initialMessage, sender: 'bot' }]);
    } catch (error) {
      console.error('Initialization failed:', error);
      setMessages([{ id: 'error', text: 'Sorry, I couldn\'t connect to the service. Please check your API key and try again.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);


  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const extractJsonFromString = (text: string): OrderDetails | null => {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        // Basic validation
        if (parsed.items && parsed.deliveryTime) {
          return parsed as OrderDetails;
        }
      } catch (error) {
        console.error('Failed to parse order JSON:', error);
        return null;
      }
    }
    return null;
  };

  const handleSend = async () => {
    if (userInput.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: userInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const chat = chatSessionRef.current;
      if (!chat) {
        throw new Error("Chat session not initialized.");
      }
      
      const botResponseText = await sendMessage(chat, userInput);
      
      const orderDetails = extractJsonFromString(botResponseText);

      if (orderDetails) {
        onOrderConfirmed(orderDetails);
        const confirmationMessage: Message = {
            id: 'confirm',
            text: 'Great! Here is your order summary.',
            sender: 'bot'
        };
        setMessages(prev => [...prev, confirmationMessage]);
      } else {
        const botMessage: Message = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
        setMessages(prev => [...prev, botMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { id: 'error-send', text: 'Oops, something went wrong. Please try again.', sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/80">
      <div className="flex-grow p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages.length > 0 && (
           <div className="flex justify-start">
             <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex-shrink-0"></div>
                <div className="bg-gray-700 rounded-2xl p-4 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-0"></span>
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-200"></span>
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-400"></span>
                </div>
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700/80 bg-gray-800">
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            onKeyPress={handleKeyPress}
            placeholder="Type your order details..."
            disabled={isLoading}
            className="w-full bg-gray-700 border-2 border-transparent rounded-full py-3 px-6 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || userInput.trim() === ''}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white rounded-full p-2.5 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
