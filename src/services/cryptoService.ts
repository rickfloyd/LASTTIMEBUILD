import axios from 'axios';

const API_URL = '/api/crypto';

export const getCryptoMarkets = async (page: number = 1) => {
    try {
        const response = await axios.get(`${API_URL}/markets`, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching crypto market data:", error);
        throw error;
    }
};