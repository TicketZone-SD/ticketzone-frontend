import { CartItem } from "./order";

export interface Event {
  id: number;
  name: string;
  description: string;
  local: string;
  date: string;
  capacity: number;
  price: number;
  category: {
    id: number,
    name: string,
    description?: string,
  };
  organizer: number;
}

export interface EventDetailsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedEvent: Event | null;
  handleAddToCart: (items: CartItem[]) => void;
}
