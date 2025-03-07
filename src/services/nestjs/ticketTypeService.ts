import { apiNest } from "../api";
import { TicketType } from "@/interfaces/ticketType";

export const createTicketType = async (ticketTypeData: TicketType) => {
  try {
    const response = await apiNest.post("/types/", ticketTypeData);
    return response.data;
  }
  catch (error) {
    console.error("Erro ao criar tipo de ingresso", error);
    throw error;
  }
}

export const getTicketTypes = async () => {
  try {
    const response = await apiNest.get("/types");
    return response.data;
  }
  catch (error) {
    console.error("Erro ao buscar tipos de ingresso", error);
    throw error;
  }
}

export const getTicketTypeById = async (id: number) => {
  try {
    const response = await apiNest.get(`/types/${id}`);
    return response.data;
  }
  catch (error) {
    console.error("Erro ao buscar tipo de ingresso", error);
    throw error;
  }
}

export const getTicketTypesByEvent = async (eventId: number) => {
  try {
    const response = await apiNest.get(`/types/event/${eventId}`);
    return response.data;
  }
  catch (error) {
    console.error("Erro ao buscar tipos de ingresso por evento", error);
    throw error;
  }
}

export const updateTicketType = async (updateData: TicketType) => {
  try {
    const response = await apiNest.patch(`/types/${updateData.id}`, updateData);
    return response.data;
  }
  catch (error) {
    console.error("Erro ao atualizar tipo de ingresso", error);
    throw error;
  }
}

export const deleteTicketType = async (id: number) => {
  try {
    const response = await apiNest.delete(`/types/${id}`);
    return response.data;
  }
  catch (error) {
    console.error("Erro ao deletar tipo de ingresso", error);
    throw error;
  }
}
