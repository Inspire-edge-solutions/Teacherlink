import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map = ({ initialCenter, initialZoom, marker, markerLabel }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const locationMarker = useRef(null);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    const apiKey = import.meta.env.VITE_AWS_LOCATION_API_KEY;
    const region = "ap-south-1";
    const style = "Standard";
    const colorScheme = "Light";

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geo.${region}.amazonaws.com/v2/styles/${style}/descriptor?key=${apiKey}&color-scheme=${colorScheme}`,
      center: initialCenter || [77.5946, 12.9716],
      zoom: initialZoom || 11,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    return () => {
      if (locationMarker.current) {
        locationMarker.current.remove();
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle marker updates
  useEffect(() => {
    if (!map.current || !marker?.coordinates) return;

    // Remove existing marker
    if (locationMarker.current) {
      locationMarker.current.remove();
    }

    // Create marker element
    const markerElement = document.createElement('div');
    markerElement.innerHTML = `
      <svg 
        viewBox="0 0 24 24" 
        width="30" 
        height="30" 
        style="fill: #ff0000; filter: drop-shadow(0 2px 2px rgba(10, 9, 9, 0.3));"
      >
        <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z"/>
      </svg>
    `;
    markerElement.style.cursor = 'pointer';

    // Create and add new marker
    locationMarker.current = new maplibregl.Marker({
      element: markerElement,
      anchor: 'bottom' // This ensures the point of the pin is at the exact location
    })
      .setLngLat(marker.coordinates)
      .addTo(map.current);

    // Add popup if label exists
    if (markerLabel) {
      const popup = new maplibregl.Popup({ 
        offset: [0, -35],  // Offset adjusted for pin icon
        className: 'custom-popup'
      })
        .setHTML(`<h4>${markerLabel}</h4>`);
      locationMarker.current.setPopup(popup);
    }

    // Center map on marker
    map.current.flyTo({
      center: marker.coordinates,
      zoom: 15,
      essential: true
    });

  }, [marker, markerLabel]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative'
        }} 
      />
    </div>
  );
};

export default Map;
