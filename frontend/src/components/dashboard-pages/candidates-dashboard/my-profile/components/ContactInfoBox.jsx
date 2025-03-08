import React, { useState } from 'react';
import Map from "../../../Map";

const ContactInfoBox = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${"https://8ttpxl67x0.execute-api.ap-south-1.amazonaws.com/dev/map"}?text=${encodeURIComponent(searchQuery)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': import.meta.env.VITE_AWS_LOCATION_API_KEY,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Access denied. Please check your API key configuration.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.Results && data.Results.length > 0) {
                const location = data.Results[0];
                setLatitude(location.Place.Geometry.Point[1]);
                setLongitude(location.Place.Geometry.Point[0]);
                setSelectedLocation({
                    coordinates: [location.Place.Geometry.Point[0], location.Place.Geometry.Point[1]],
                    label: location.Place.Label
                });
            } else {
                setError('No results found for this location');
            }
        } catch (error) {
            console.error('Error searching location:', error);
            setError('Failed to search location. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (!latitude || !longitude) {
            alert('Please search for a location first');
            return;
        }
        // Here you can add the logic to save the location to your backend
        console.log('Saving location:', { latitude, longitude, label: selectedLocation?.label });
    };

    return (
        <div className="default-form">
            <div className="row">
                {/* Search Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <input
                        type="text"
                        name="search"
                        placeholder="Find on Map"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        disabled={isLoading}
                    />
                </div>

                {/* Latitude Input */}
                <div className="form-group col-lg-3 col-md-12">
                    <input
                        type="text"
                        name="latitude"
                        placeholder="Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        readOnly
                    />
                </div>

                {/* Longitude Input */}
                <div className="form-group col-lg-3 col-md-12">
                    <input
                        type="text"
                        name="longitude"
                        placeholder="Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        readOnly
                    />
                </div>

                {/* Search Button */}
                <div className="form-group col-lg-12 col-md-12">
                    <button 
                        type="button"
                        className="theme-btn btn-style-three"
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Searching...' : 'Search Location'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="form-group col-lg-12 col-md-12">
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    </div>
                )}

                {/* Map */}
                <div className="form-group col-lg-12 col-md-12">
                    <div className="map-outer">
                        <div style={{ height: "420px", width: "100%" }}>
                            <Map 
                                initialCenter={selectedLocation?.coordinates}
                                initialZoom={selectedLocation ? 15 : 11}
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="form-group col-lg-12 col-md-12">
                    <button 
                        type="button"
                        className="theme-btn btn-style-three"
                        onClick={handleSave}
                        disabled={!selectedLocation}
                    >
                        Save Location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoBox;