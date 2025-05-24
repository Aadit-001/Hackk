import axios from 'axios';
import { HERE_API_KEY } from '@env';

export const fetchRouteWithShape = async (origin, destination, mode = 'pedestrian') => {
  try {
    if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
      throw new Error('Invalid coordinates');
    }

    const response = await axios.get('https://router.hereapi.com/v8/routes', {
      params: {
        transportMode: mode,
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        return: 'polyline,summary,actions,instructions',
        apiKey: HERE_API_KEY
      },
      timeout: 10000
    });

    if (!response.data.routes?.[0]) {
      throw new Error('No route found');
    }

    const route = response.data.routes[0];
    const section = route.sections[0];

    return {
      distance: section.summary.length,
      duration: section.summary.duration,
      polyline: section.polyline
    };

  } catch (error) {
    console.error('Route API Error:', error.response?.data || error.message);
    throw error;
  }
};
