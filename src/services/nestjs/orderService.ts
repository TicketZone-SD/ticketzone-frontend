import { Order } from "@/interfaces/order";
import { apiNest } from "../api";

export const createOrder = async (order: Order) => {
  try {
    const response = await apiNest.post("/orders", order);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pedido", error);
    throw error;
  }
}

export const getOrders = async () => {
  try {
    const response = await apiNest.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedidos", error);
    throw error;
  }
}

export const getOrderById = async (id: number) => {
  try {
    const response = await apiNest.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedido", error);
    throw error;
  }
}

export const getOrdersByUser = async (userId: number) => {
  try {
    const response = await apiNest.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedidos por usuário", error);
    throw error;
  }
}

export const updateOrder = async (order: Order) => {
  try {
    const response = await apiNest.patch(`/orders/${order.id}`, order);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar pedido", error);
    throw error;
  }
}

export const deleteOrder = async (id: number) => {
  try {
    const response = await apiNest.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar pedido", error);
    throw error;
  }
}
