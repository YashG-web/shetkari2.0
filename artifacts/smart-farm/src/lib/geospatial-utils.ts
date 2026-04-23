import * as turf from '@turf/turf';

/**
 * Detects (or simulates detection of) a real farm boundary polygon.
 */
/**
 * Detects (or simulates detection of) a real farm boundary polygon.
 * Upgraded to prioritize small farmer parcels and visible boundaries (fences, bunds, dividers).
 */
/**
 * Detects a real farm boundary polygon and automatically subtracts buildings.
 * Returns a Turf-compatible GeoJSON geometry (can be Polygon or MultiPolygon with holes).
 */
export async function detectFarmBoundary(lat: number, lon: number, sizeHint: 'small' | 'large' = 'small'): Promise<any> {
  try {
    const overpassQuery = `
      [out:json];
      (
        way["landuse"~"farmland|orchard|vineyard"](around:1000, ${lat}, ${lon});
        way["building"](around:800, ${lat}, ${lon});
      );
      out body;
      >;
      out skel qt;
    `;
    
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery
    });
    const data = await res.json();

    if (data.elements && data.elements.length > 0) {
      const targetPoint = turf.point([lon, lat]);
      const ways = data.elements.filter((el: any) => el.type === 'way' && el.nodes && el.nodes.length > 2);
      
      const buildingPolys = ways
        .filter(w => data.elements.find(el => el.id === w.id && el.tags && el.tags.building))
        .map(w => {
           const c = w.nodes.map(n => {
              const node = data.elements.find(el => el.id === n);
              return node ? [node.lon, node.lat] : null;
           }).filter(Boolean);
           if (c.length < 3) return null;
           const closed = [...c];
           if (closed[0][0] !== closed[closed.length-1][0]) closed.push(closed[0]);
           return turf.polygon([closed]);
        }).filter(Boolean);

      const farmlands = ways.filter(w => !data.elements.find(el => el.id === w.id && el.tags && el.tags.building));
      
      let bestParcel = null;
      let minArea = Infinity;

      for (const way of farmlands) {
        const coords = way.nodes.map(n => {
          const node = data.elements.find(el => el.id === n);
          return node ? [node.lon, node.lat] : null;
        }).filter(Boolean);

        if (coords.length < 3) continue;
        const closed = [...coords];
        if (closed[0][0] !== closed[closed.length-1][0]) closed.push(closed[0]);
        if (closed.length < 4) continue;

        try {
          const poly = turf.polygon([closed]);
          if (turf.booleanPointInPolygon(targetPoint, poly)) {
            const area = turf.area(poly);
            if (area < minArea && area > 2000) { 
               minArea = area;
               bestParcel = poly;
            }
          }
        } catch (e) {}
      }

      if (bestParcel) {
        // PUNCH HOLES for buildings inside the farmland
        let finalGeometry = bestParcel;
        for (const b of buildingPolys) {
           try {
             if (turf.booleanOverlap(finalGeometry, b) || turf.booleanContains(finalGeometry, b)) {
                const diff = turf.difference(turf.featureCollection([finalGeometry, b]));
                if (diff) finalGeometry = diff;
             }
           } catch (e) {}
        }
        return turf.feature(finalGeometry.geometry);
      }
    }
  } catch (e) {}

  // Fallback to organic simulation (but ensure it's small)
  const sim = generateSimulatedPolygon(lat, lon, sizeHint);
  return turf.polygon([sim.map(c => [c[1], c[0]])]);
}

/**
 * Generates an irregular but plot-like boundary for a single farmer plot.
 */
function generateSimulatedPolygon(lat: number, lon: number, sizeHint: 'small' | 'large' = 'small'): number[][] {
  const seed = (Math.abs(lat) * 1000 + Math.abs(lon) * 1000) % 100;
  
  // Tilted/Organic Parcels (Real-world fields are rarely perfect North-South)
  const tilt = (seed % 20 - 10) * (Math.PI / 180); // Up to 10 degree tilt
  
  const baseSize = sizeHint === 'small' ? 0.0008 : 0.0018;
  const sizeLat = baseSize + (seed % 5) * 0.0001; 
  const sizeLon = sizeLat * (0.8 + (seed % 4) * 0.1); 

  // Generate 4 main corners with organic jitter
  const corners = [
    [-sizeLat/2, -sizeLon/2],
    [sizeLat/2, -sizeLon/2.2],
    [sizeLat/2.1, sizeLon/2],
    [-sizeLat/2.3, sizeLon/2.1]
  ];

  const polygon: number[][] = corners.map(([dLat, dLon]) => {
    // Apply rotation/tilt
    const rLat = dLat * Math.cos(tilt) - dLon * Math.sin(tilt);
    const rLon = dLat * Math.sin(tilt) + dLon * Math.cos(tilt);
    
    // Apply micro-jitter (1-3 meters)
    const jitter = (Math.sin(dLat * 10000 + seed) * 0.00002);
    
    return [lat + rLat + jitter, lon + rLon + jitter];
  });

  polygon.push(polygon[0]); // Close it
  return polygon;
}

/**
 * Generates a square-meter style grid strictly inside and clipped to the boundary.
 */
export function generateSmartGridCells(input: any, cellSizeInMeters: number = 10) {
  // Support both GeoJSON (Feature/Geometry) and flat coordinate arrays [lat, lon][]
  let feature = input;
  
  if (Array.isArray(input)) {
    if (input.length < 3) return [];
    const coords = input.map(p => [p[1], p[0]]);
    if (coords[0][0] !== coords[coords.length-1][0]) coords.push(coords[0]);
    feature = turf.polygon([coords]);
  } else if (input && input.type !== 'Feature') {
    feature = turf.feature(input);
  }

  if (!feature || !feature.geometry) {
    console.warn("Invalid geometry passed to generateSmartGridCells:", input);
    return [];
  }
  
  try {
    const bbox = turf.bbox(feature);
    const grid = turf.squareGrid(bbox, cellSizeInMeters / 1000, { units: 'kilometers' });
    const clippedCells = [];
    
    for (const cell of grid.features) {
      try {
        const intersection = turf.intersect(turf.featureCollection([cell, feature]));
        if (intersection && intersection.geometry) {
          const center = turf.centroid(intersection).geometry.coordinates;
          clippedCells.push({
            id: `G-${clippedCells.length}`,
            geometry: intersection.geometry,
            center: [center[1], center[0]],
            status: 'Healthy',
            color: '#10b981',
            totalStress: Math.random() * 20,
            needs: { water: 0, n: 0, p: 0, k: 0, pesticide: 0 },
            recommendations: ["Optimal Condition"]
          });
        }
      } catch (e) {}
    }
    return clippedCells;
  } catch (e) {
    console.error("Error generating smart grid cells:", e);
    return [];
  }
}
