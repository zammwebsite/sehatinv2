
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from '../components/ChatMessage';
import { supabase } from '../services/supabaseService';
import { createChatSession } from '../services/geminiService';
import { SendIcon } from '../components/Icons';
import type { Chat } from '@google/genai';

const AIChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchChatHistory = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      setMessages(data as ChatMessageType[]);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
    chatSessionRef.current = createChatSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      message: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
        await supabase.from('chat_history').insert({
            message: userMessage.message,
            sender: userMessage.sender,
            user_id: user?.id,
        });

        if (!chatSessionRef.current) {
            chatSessionRef.current = createChatSession();
        }

        const stream = await chatSessionRef.current.sendMessageStream({ message: input });
        let aiResponseText = '';
        const aiMessageId = Date.now().toString() + "-ai";
        
        // Initial empty AI message for streaming
        setMessages(prev => [...prev, { id: aiMessageId, message: '', sender: 'ai', timestamp: new Date().toISOString() }]);

        for await (const chunk of stream) {
            aiResponseText += chunk.text;
            setMessages(prev => prev.map(msg => msg.id === aiMessageId ? {...msg, message: aiResponseText} : msg));
        }

        await supabase.from('chat_history').insert({
            message: aiResponseText,
            sender: 'ai',
            user_id: user?.id,
        });

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessageType = {
        id: Date.now().toString() + "-error",
        message: 'Maaf, terjadi kesalahan. Coba lagi nanti.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{height: 'calc(100vh - 5rem)'}}>
      <header className="bg-white p-4 border-b border-gray-200 shadow-sm text-center">
        <h1 className="text-xl font-bold text-green-600">Konsultasi AI Sehatin</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && (
           <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                  <span className="animate-pulse">.</span><span className="animate-pulse delay-75">.</span><span className="animate-pulse delay-150">.</span>
              </div>
              <div className="max-w-xs md:max-w-md px-4 py-3 rounded-2xl bg-gray-200 text-gray-500 rounded-bl-none text-sm italic">
                  Sehatin sedang mengetik...
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesanmu di sini..."
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading || isTyping}
          />
          <button
            type="submit"
            disabled={isLoading || isTyping || !input.trim()}
            className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <SendIcon className="w-5 h-5"/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatPage;