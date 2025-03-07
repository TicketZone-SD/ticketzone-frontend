export interface TicketType {
  id: number;
  name: string;
  description: string;
  price: number;
  capacity: number;
  event_id: number;
}

export interface TicketTypeSold {
  ticketType: {
    name: string;
    capacity: number;
    sold: number;
  };
}

export interface TicketTypeSoldTotal {
  eventId: number,
  soldTickets: number
}
