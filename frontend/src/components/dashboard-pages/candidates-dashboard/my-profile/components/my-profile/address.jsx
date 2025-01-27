import React, { useState } from "react";
import Select from "react-select";
import csc from "countries-states-cities";
import axios from "axios";

const Address = () => {
    const [formData, setFormData] = useState({
        permanentAddress: {
            country: null,
            state: null,
            city: null,
            street: ''
        },
        presentAddress: {
            country: null,
            state: null,
            city: null,
            street: '',
            sameAsPermanent: false
        }
    });

    const countries = csc.getAllCountries().map((country) => ({
        value: country.id,
        label: country.name,
    }));

    const getStates = (countryId) => {
        return countryId
            ? csc.getStatesOfCountry(countryId).map((state) => ({
                value: state.id,
                label: state.name,
            }))
            : [];
    };

    const getCities = (stateId) => {
        return stateId
            ? csc.getCitiesOfState(stateId).map((city) => ({
                value: city.id,
                label: city.name,
            }))
            : [];
    };

    const handleAddressChange = (addressType, field, value) => {
        setFormData(prev => ({
            ...prev,
            [addressType]: {
                ...prev[addressType],
                [field]: value
            }
        }));
    };

    const handleSameAsPermanent = (e) => {
        if (e.target.checked) {
            setFormData(prev => ({
                ...prev,
                presentAddress: {
                    ...prev.permanentAddress,
                    sameAsPermanent: true
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                presentAddress: {
                    country: null,
                    state: null,
                    city: null,
                    street: '',
                    sameAsPermanent: false
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData);

        try {
            const payload = {
                permanentAddress: {
                    country: formData.permanentAddress.country?.label,
                    state: formData.permanentAddress.state?.label,
                    city: formData.permanentAddress.city?.label,
                    street: formData.permanentAddress.street
                },
                presentAddress: {
                    country: formData.presentAddress.country?.label,
                    state: formData.presentAddress.state?.label,
                    city: formData.presentAddress.city?.label,
                    street: formData.presentAddress.street
                }
            };

            console.log('Sending payload:', payload);

            const response = await axios.post(
                'https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/address',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log('API Response:', response.data);

            if (response.status === 200 || response.status === 201) {
                alert('Address details saved successfully!');
            } else {
                throw new Error(response.data?.message || 'Failed to save address');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            alert(`Error: ${error.response?.data?.message || error.message || 'Failed to save address'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="default-form">
            <div className="row">
                {/* Permanent Address */}
                <div className="form-group col-lg-6 col-md-12">
                    <h3>Permanent address</h3>
                    <div className="form-group">
                        <Select
                            placeholder="Select Country"
                            options={countries}
                            value={formData.permanentAddress.country}
                            onChange={(option) => {
                                handleAddressChange('permanentAddress', 'country', option);
                                handleAddressChange('permanentAddress', 'state', null);
                                handleAddressChange('permanentAddress', 'city', null);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <Select
                            placeholder="Select State/UT"
                            options={getStates(formData.permanentAddress.country?.value)}
                            value={formData.permanentAddress.state}
                            onChange={(option) => {
                                handleAddressChange('permanentAddress', 'state', option);
                                handleAddressChange('permanentAddress', 'city', null);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <Select
                            placeholder="Select City"
                            options={getCities(formData.permanentAddress.state?.value)}
                            value={formData.permanentAddress.city}
                            onChange={(option) => handleAddressChange('permanentAddress', 'city', option)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="House no. & street"
                            value={formData.permanentAddress.street}
                            onChange={(e) => handleAddressChange('permanentAddress', 'street', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Present Address */}
                <div className="form-group col-lg-6 col-md-12">
                    <h3>Present address</h3>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                onChange={handleSameAsPermanent}
                                checked={formData.presentAddress.sameAsPermanent}
                            /> Same as permanent address
                        </label>
                    </div>
                    {!formData.presentAddress.sameAsPermanent && (
                        <>
                            <div className="form-group">
                                <Select
                                    placeholder="Select Country"
                                    options={countries}
                                    value={formData.presentAddress.country}
                                    onChange={(option) => {
                                        handleAddressChange('presentAddress', 'country', option);
                                        handleAddressChange('presentAddress', 'state', null);
                                        handleAddressChange('presentAddress', 'city', null);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <Select
                                    placeholder="Select State/UT"
                                    options={getStates(formData.presentAddress.country?.value)}
                                    value={formData.presentAddress.state}
                                    onChange={(option) => {
                                        handleAddressChange('presentAddress', 'state', option);
                                        handleAddressChange('presentAddress', 'city', null);
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <Select
                                    placeholder="Select City"
                                    options={getCities(formData.presentAddress.state?.value)}
                                    value={formData.presentAddress.city}
                                    onChange={(option) => handleAddressChange('presentAddress', 'city', option)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="House no. & street"
                                    value={formData.presentAddress.street}
                                    onChange={(e) => handleAddressChange('presentAddress', 'street', e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Submit Button */}
                <div className="form-group col-lg-12 col-md-12">
                    <button type="submit" className="theme-btn btn-style-one">
                        Save Address
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Address;
