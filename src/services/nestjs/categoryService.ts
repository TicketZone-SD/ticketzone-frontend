
import { Category } from "@/interfaces/category";
import { apiNest } from "../api";

export const createCategory = async (categoryData: Category) => {
  try {
    const response = await apiNest.post("/categories/", categoryData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar categoria", error);
    throw error;
  }
}

export const getCategories = async () => {
  try {
    const response = await apiNest.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias", error);
    throw error;
  }
}

export const getCategoryById = async (id: number) => {
  try {
    const response = await apiNest.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categoria", error);
    throw error;
  }
}

export const updateCategory = async (updateData: Category) => {
  try {
    const response = await apiNest.patch(`/categories/${updateData.id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar categoria", error);
    throw error;
  }
}

export const deleteCategory = async (id: number) => {
  try {
    const response = await apiNest.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar categoria", error);
    throw error;
  }
}
