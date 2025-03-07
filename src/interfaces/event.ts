export interface Event {
  id: number;
  name: string;
  description: string;
  local: string;
  date: string;
  capacity: number;
  price: number;
  category_id?: number;
  organizer: number;
}

export interface EventDetailsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedEvent: Event | null;
  handleAddToCart: (quantity: number) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export interface CartItem extends Event {
  quantity: number;
}
