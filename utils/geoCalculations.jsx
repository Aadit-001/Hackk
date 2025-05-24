export const calculateCompassHeading = (acc, mag) => {
  const Ax = acc.x, Ay = acc.y, Az = acc.z;
  const Mx = mag.x, My = mag.y, Mz = mag.z;

  const pitch = Math.atan2(-Ax, Math.sqrt(Ay * Ay + Az * Az));
  const roll = Math.atan2(Ay, Az);
  
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const cosRoll = Math.cos(roll);
  const sinRoll = Math.sin(roll);

  const Mx2 = Mx * cosRoll + Mz * sinRoll;
  const My2 = Mx * sinPitch * sinRoll + My * cosPitch - Mz * sinPitch * cosRoll;
  
  let heading = (Math.atan2(My2, Mx2) * 180) / Math.PI;
  
  // Normalize to 0-360 degrees
  if (heading < 0) heading += 360;
  
  return heading;
};

export const calculatePitch = (accData) => {
  if (!accData) return 0;
  const { x, y, z } = accData;
  return Math.atan2(-y, Math.sqrt(x * x + z * z)) * (180 / Math.PI);
};

export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
          Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  
  // Normalize to 0-360 degrees
  return (bearing + 360) % 360;
};

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lng2-lng1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

// Enhanced heading interpolation for smooth AR
export const interpolateHeading = (current, target, factor = 0.1) => {
  let diff = target - current;
  
  // Handle 360-degree wrap-around
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  let newHeading = current + diff * factor;
  
  // Normalize result
  if (newHeading < 0) newHeading += 360;
  if (newHeading >= 360) newHeading -= 360;
  
  return newHeading;
};
