export interface Order {
  id: number;
  user_id: number;
  event_id: number;
  ticket_type_id: number;
  quantity: number;
  total_price: number;
  status: string;
}

export interface OrderByUser {
  id: number;
  user_id: number;
  event: {
    id: number;
    name: string;
    description: string;
    date: string;
    local: string;
    capacity: number;
    price: number;
  };
  ticketType: {
    id: number;
    name: string;
    description: string;
    price: number;
  };
  status: string;
  quantity: number;
  total_price: number;
}

export interface CartItem {
  event_id: number;
  event_name: string;
  ticket_type_id: number;
  ticket_name: string;
  price: number;
  quantity: number;
  total_price: number;
}
