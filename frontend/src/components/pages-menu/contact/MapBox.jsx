import Map from '../../dashboard-pages/Map';

const MapBox = () => {
  return (
    <div className="map-canvas" style={{ height: '400px' }}>
      <Map 
        initialCenter={[77.6163276, 12.9994466]}
        initialZoom={15}
        marker={{
          coordinates: [77.6163276, 12.9994466]
        }}
        markerLabel="13/2 Standage Road, Pulikeshi Nagar"
      />
    </div>
  );
};

export default MapBox;
