
import React from 'react';
import { type OrderDetails } from '../types';

interface OrderSummaryProps {
  orderDetails: OrderDetails;
  onNewOrder: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ orderDetails, onNewOrder }) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center h-full bg-gray-800 text-white animate-fade-in">
        <div className="w-full max-w-lg bg-gray-900/50 border border-gray-700 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-orange-400 mb-2">Order Confirmed!</h2>
            <p className="text-center text-gray-400 mb-8">Your order is scheduled for delivery.</p>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2 mb-4">Delivery Time</h3>
                <p className="text-2xl font-bold text-center text-white">{orderDetails.deliveryTime}</p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2 mb-4">Items</h3>
                <ul className="space-y-4">
                {orderDetails.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-start bg-gray-800 p-4 rounded-lg">
                    <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        {item.notes && <p className="text-sm text-gray-400">({item.notes})</p>}
                    </div>
                    <p className="font-bold text-orange-400 text-lg">x {item.quantity}</p>
                    </li>
                ))}
                </ul>
            </div>

            <button
                onClick={onNewOrder}
                className="w-full mt-10 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 transition-all duration-300 transform hover:scale-105"
            >
                Place Another Order
            </button>
        </div>
    </div>
  );
};

// Add fade-in animation to tailwind config if possible, or define here
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);


export default OrderSummary;
