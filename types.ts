
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

export interface OrderDetails {
  items: OrderItem[];
  deliveryTime: string;
}
