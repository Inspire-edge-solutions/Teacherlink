


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLocation } from "../../../features/filter/employerFilterSlice";
import { BsGeoAltFill } from "react-icons/bs";
const LocationBox = () => {
    const { location } = useSelector((state) => state.employerFilter);
    const [getLocation, setLocation] = useState(location);
    const dispath = useDispatch();

    // location handler
    const locationHandler = (e) => {
        dispath(addLocation(e.target.value));
    };

    useEffect(() => {
        setLocation(location);
    }, [setLocation, location]);

    return (
        <>
            <input
                type="text"
                name="listing-search"
                placeholder="City or postcode"
                value={getLocation}
                onChange={locationHandler}
            />
            <span className="icon"><BsGeoAltFill /></span>
        </>
    );
};

export default LocationBox;
