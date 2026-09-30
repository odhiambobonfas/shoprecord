import { api } from './api.service';
import { ENDPOINTS } from '../utils/constants.utils';

// Get all products
export const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString 
    ? `${ENDPOINTS.PRODUCTS.LIST}?${queryString}` 
    : ENDPOINTS.PRODUCTS.LIST;
  
  const data = await api.get(endpoint);
  return data;
};

// Get single product by ID
export const getProduct = async (id) => {
  const data = await api.get(ENDPOINTS.PRODUCTS.DETAIL(id));
  return data;
};

// Create new product
export const createProduct = async (productData) => {
  const data = await api.post(ENDPOINTS.PRODUCTS.CREATE, productData);
  return data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const data = await api.put(ENDPOINTS.PRODUCTS.UPDATE(id), productData);
  return data;
};

// Delete product
export const deleteProduct = async (id) => {
  const data = await api.delete(ENDPOINTS.PRODUCTS.DELETE(id));
  return data;
};

// Search products
export const searchProducts = async (searchTerm) => {
  const data = await api.get(`${ENDPOINTS.PRODUCTS.LIST}?search=${searchTerm}`);
  return data;
};

const productService = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};

export default productService;
