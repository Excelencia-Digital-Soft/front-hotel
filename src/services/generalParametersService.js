// src/services/generalParametersService.js
import axiosClient from '../axiosClient';

const GENERAL_PARAMETERS_API_PATH = '/GeneralParameters';

export default {
  async getGeneralParameters() {
    try {
      const response = await axiosClient.get(GENERAL_PARAMETERS_API_PATH);
      return response.data;
    } catch (error) {
      console.error('Error fetching general parameters:', error);
      throw error;
    }
  },
};