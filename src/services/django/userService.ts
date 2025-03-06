import { User } from "@/interfaces/user";
import { apiDjango } from "../api";

export const login = async (username: string, password: string) => {
  try {
    const response = await apiDjango.post("/users/login/", { username, password });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao fazer login: ${error}`);
  }
}

export const createUser = async (userData: User) => {
  try {
    const response = await apiDjango.post("/users/register/", userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário", error);
    throw error;
  }
};

export const getUsers = async (token: string) => {
  try {
    const response = await apiDjango.get("/users/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários", error);
    throw error;
  }
};

export const getUserById = async (token: string , id: number) => {
  try {
    const response = await apiDjango.get(`/users/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário", error);
    throw error;
  }
}

export const updateUser = async (token: string, updateData: User) => {
  try {
    const response = await apiDjango.put(`/users/me/`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário", error);
    throw error;
  }
}

export const deleteUser = async (token: string) => {
  try {
    await apiDjango.delete(`/users/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Erro ao deletar usuário", error);
    throw error;
  }
}
