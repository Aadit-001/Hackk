import axios from 'axios';
// import { HERE_API_KEY } from '@env';
import { calculateDistance } from '../utils/geoCalculations';

export const fetchBuildings = async (coords) => {
  try {
    const response = await axios.get(
      'https://browse.search.hereapi.com/v1/browse',
      {
        params: {
          at: `${coords.latitude},${coords.longitude}`,
          apiKey: process.env.HERE_API_KEY,
          limit: 50,
          radius: 100,
          categories: '100-1000-0000,300-3000-0000', // Valid category IDs
          lang: 'en'
        }
      }
    );

    return response.data.items.map(item => ({
      id: item.id,
      name: item.title,
      lat: item.position.lat,
      lng: item.position.lng,
      distance: calculateDistance(
        coords.latitude,
        coords.longitude,
        item.position.lat,
        item.position.lng
      ),
      category: item.categories?.[0]?.name || 'Building',
      address: item.address?.label || 'Address not available'
    }));
  } catch (error) {
    console.error('HERE API Error:', error.response?.data || error.message);
    return [];
  }
};
