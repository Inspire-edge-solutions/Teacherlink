import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import jobFeatures from "@/data/job-featured";

const Map = ({ initialCenter, initialZoom, marker, markerLabel }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const markers = useRef([]);
  const locationMarker = useRef(null); // Reference for the search location marker

  useEffect(() => {
    if (map.current) return; // initialize map only once

    const apiKey = import.meta.env.VITE_AWS_LOCATION_API_KEY;
    const region = "ap-south-1";
    const style = "Standard";
    const colorScheme = "Light";

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geo.${region}.amazonaws.com/v2/styles/${style}/descriptor?key=${apiKey}&color-scheme=${colorScheme}`,
      center: initialCenter || [77.5946, 12.9716], // Use provided center or default to Bengaluru
      zoom: initialZoom || 11,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    // Wait for map to load before adding markers
    map.current.on('load', () => {
      // Add markers for each job
      jobFeatures.slice(0, 6).forEach((job) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.backgroundColor = '#ff4d4d';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';

        const marker = new maplibregl.Marker(el)
          .setLngLat([Number(job.long), Number(job.lat)])
          .addTo(map.current);

        // Add click event
        el.addEventListener('click', () => {
          setSelectedMarker(job);
          marker.togglePopup();
        });

        markers.current.push(marker);
      });
    });

    // Cleanup on unmount
    return () => {
      markers.current.forEach(marker => marker.remove());
      if (locationMarker.current) {
        locationMarker.current.remove();
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCenter, initialZoom]);

  // Effect to handle marker updates
  useEffect(() => {
    if (!map.current || !marker) return;

    // Remove existing location marker if it exists
    if (locationMarker.current) {
      locationMarker.current.remove();
    }

    // Create new marker element
    const el = document.createElement('div');
    el.className = 'location-marker';
    el.style.width = '25px';
    el.style.height = '25px';
    el.style.backgroundColor = '#FF0000';
    el.style.borderRadius = '50%';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

    // Create and add new marker
    locationMarker.current = new maplibregl.Marker(el)
      .setLngLat(marker.coordinates)
      .addTo(map.current);

    // Add popup if label is provided
    if (markerLabel) {
      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`<h4>${markerLabel}</h4>`);
      
      locationMarker.current.setPopup(popup);
    }

    // Fly to the marker location
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
      {selectedMarker && (
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            maxWidth: '300px',
            zIndex: 1
          }}
        >
          <h4>{selectedMarker.jobTitle}</h4>
          <p>{selectedMarker.company}</p>
          <p>{selectedMarker.location}</p>
          <button 
            onClick={() => setSelectedMarker(null)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;
