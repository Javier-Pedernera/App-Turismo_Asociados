// src/actions/promotionActions.ts
import { Dispatch } from 'redux';
import axios from 'axios';
import { addPromotion, setConsumedPromotions, setPromotions, setPromotionsError, updateConsumedPromotion, updatePromotion } from '../reducers/promotionReducer';
import {  PromotionCreate, PromotionUpdate } from '../types/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchPromotions = (partnerId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/partners/${partnerId}/promotions`);
      const activePromotions = response.data.filter((promotion:any) => promotion.status?.name !== 'deleted');
      // console.log("promociones activaaaaaaaaaas",activePromotions);
      
      dispatch(setPromotions(activePromotions));
    } catch (firstError: any) {
      console.error('First attempt to fetch promotions failed:', firstError.message);
      if (axios.isAxiosError(firstError)) {
        console.error('Axios error details:', firstError.toJSON());
      }
    }
  };
};



export const createPromotion = (promotion: PromotionCreate) => {
  return async (dispatch: Dispatch) => {
    console.log("promocion en la action", promotion);
    try {
      // Validar que las imágenes estén en el formato correcto
      // if (!promotion.images || promotion.images.length === 0) {
      //   throw new Error('No se han proporcionado imágenes para la promoción.');
      // }
      // Enviar datos al backend
      const response = await axios.post(`${API_URL}/promotions`, promotion);

      // Despachar la acción si la solicitud es exitosa
      dispatch(addPromotion(response.data));
      return response
    } catch (error: any) {
      console.error('Error creando la promoción:', error.message);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error de Axios:', error.toJSON());
      }
      throw error; // Permitir que el error sea manejado donde se llame esta acción
    }
  };
};

export const modifyPromotion = (promotionId: number, data: any, deletedImageIds: number[]) => {
  return async (dispatch: Dispatch) => {
    try {
      if (deletedImageIds.length) {
        const imgDelete = { 'image_ids': deletedImageIds };
        console.log(imgDelete);
        const responseDeleted = await axios.post(`${API_URL}/promotion_images/delete`, imgDelete);
        console.log(responseDeleted);
      }
      const response = await axios.put(`${API_URL}/promotions/${promotionId}`, data);
      console.log("respuesta de actualizacion",response);
      
      dispatch(updatePromotion(response.data));
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  };
};

export const deletePromotion = (promotionId: number, data: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const dataSend = {status_id: data}
      // console.log("imprimo status",dataSend);
      
      const response = await axios.put(`${API_URL}/promotions/${promotionId}`, dataSend);
      console.log(response.data);
      
      dispatch(updatePromotion(response.data));
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  };
};

export const submitConsumption = (data: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${API_URL}/promotion_consumeds`, data);
      return response
      // Si es necesario, puedes despachar otra acción para actualizar el estado de las promociones
      // dispatch(someAction(response.data));
    } catch (error: any) {
      console.error('Error submitting consumption:', error.message);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.toJSON());
      }

      // Manejo de errores en caso de fallo
      dispatch(setPromotionsError('Failed to submit promotion consumption.'));
    }
  };
};

export const fetchConsumedPromotions = (partnerId: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/promotion_consumeds/partner/${partnerId}`);
      dispatch(setConsumedPromotions(response.data));
    } catch (error: any) {
      console.error('Error fetching consumed promotions:', error.message);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.toJSON());
      }

      // Manejo de errores
      dispatch(setPromotionsError('Failed to fetch consumed promotions.'));
    }
  };
};

export const deletePromotionConsumed = (promconsumedId: number, data:any) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put(`${API_URL}/promotion_consumeds/${promconsumedId}`, data);
      dispatch(updateConsumedPromotion(response.data))
      return response 
    } catch (error: any) {
      console.error('Error fetching consumed promotions:', error.message);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.toJSON());
      }
      // Manejo de errores
      dispatch(setPromotionsError('Failed to fetch consumed promotions.'));
    }
  };
};
