import { Event } from "@/interfaces/event";
import { apiNest } from "../api";

export const createEvent = async (eventData: Event) => {
  try {
    const response = await apiNest.post("/events/", eventData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar evento", error);
    throw error;
  }
}

export const getEvents = async () => {
  try {
    const response = await apiNest.get("/events");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar eventos", error);
    throw error;
  }
}

export const getEventById = async (id: number) => {
  try {
    const response = await apiNest.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar evento", error);
    throw error;
  }
}

export const getTicketSoldByEvent = async (eventId: number) => {
  try {
    const response = await apiNest.get(`/events/${eventId}/tickets-sold-detailed`);
    return response.data;
  }
  catch (error) {
    console.error("Erro ao buscar ingressos vendidos do evento", error);
    throw error;
  }
}

export const getSoldByEvent = async (eventId: number) => {
  try {
    const response = await apiNest.get(`/events/${eventId}/sold-tickets`);
    return response.data;
  }
  catch (error) {
    console.error("Erro ao buscar ingressos vendidos do evento", error);
    throw error;
  }
}

export const getEventByOrganizer = async (organizerId: number) => {
  try {
    const response = await apiNest.get(`/events/organizer/${organizerId}`);
    return response.data;
  }
  catch (error) {
    console.error("Erro ao buscar eventos do organizador", error);
    throw error;
  }
}

export const updateEvent = async (updateData: Event) => {
  try {
    const response = await apiNest.patch(`/events/${updateData.id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar evento", error);
    throw error;
  }
}

export const deleteEvent = async (id: number) => {
  try {
    const response = await apiNest.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar evento", error);
    throw error;
  }
}
