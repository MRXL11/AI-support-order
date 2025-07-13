
import React, { useState, useCallback } from 'react';
import ChatWindow from './components/ChatWindow';
import OrderSummary from './components/OrderSummary';
import { type OrderDetails } from './types';
import { BotIcon } from './components/icons/BotIcon';

const App: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [view, setView] = useState<'chat' | 'summary'>('chat');

  const handleOrderConfirmed = useCallback((details: OrderDetails) => {
    setOrderDetails(details);
    setView('summary');
  }, []);

  const handleNewOrder = () => {
    setOrderDetails(null);
    setView('chat');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 selection:bg-orange-500/30">
      <div className="w-full max-w-4xl h-[90vh] max-h-[800px] flex flex-col">
        <header className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
                <BotIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">GourmetGo AI Assistant</h1>
          </div>
          <p className="text-gray-400 mt-2">Your personal food ordering chatbot.</p>
        </header>
        
        <main className="flex-grow w-full h-full bg-gray-800/50 rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-sm border border-gray-700/50 overflow-hidden">
          {view === 'chat' && <ChatWindow onOrderConfirmed={handleOrderConfirmed} />}
          {view === 'summary' && orderDetails && (
            <OrderSummary orderDetails={orderDetails} onNewOrder={handleNewOrder} />
          )}
        </main>

        <footer className="text-center mt-6 text-gray-500 text-sm leading-relaxed">
          <p>Phát triển bởi</p>
          <p>Họ và tên: Bùi Văn Dương</p>
          <p>Đợt đào tạo thực tế Hợp tác giữa FPT Polytechnic và IMTA TECH, Cán bộ Hướng dẫn: Trần Tuấn Thành.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
