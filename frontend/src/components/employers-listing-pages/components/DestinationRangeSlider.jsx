


// import { useEffect, useState } from "react";
// import Range from "rc-slider";
// import { useDispatch, useSelector } from "react-redux";
// import { addDestination } from "../../../features/filter/employerFilterSlice";

// const DestinationRangeSlider = () => {
//     const { destination } = useSelector((state) => state.employerFilter);
//     const [getDestination, setDestination] = useState({
//         min: destination.min,
//         max: destination.max,
//     });

//     const dispatch = useDispatch();

//     // destiations handler
//     const handleOnChange = (value) => {
//         dispatch(addDestination(value));
//     };

//     useEffect(() => {
//         setDestination(destination);
//     }, [setDestination, destination]);

//     return (
//         <div className="range-slider-one">
//             <Range
//                 formatLabel={(value) => ``}
//                 minValue={0}
//                 maxValue={100}
//                 value={getDestination}
//                 onChange={(value) => handleOnChange(value)}
//             />
//             <div className="input-outer">
//                 <div className="amount-outer">
//                     <span className="area-amount">{getDestination.max}</span>
//                     km
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DestinationRangeSlider;

import { useEffect, useState } from "react";
import Range from "rc-slider";
import { useDispatch, useSelector } from "react-redux";
import { addDestination } from "../../../features/filter/candidateFilterSlice";

const DestinationRangeSlider = () => {
    const { destination } = useSelector((state) => state.candidateFilter);
    const [getDestination, setDestination] = useState({
        min: destination.min,
        max: destination.max,
    });

    const dispatch = useDispatch();

    // Destination handler
    const handleOnChange = (value) => {
        dispatch(addDestination({ min: value[0], max: value[1] }));
    };

    // Update local state when destination changes
    useEffect(() => {
        setDestination(destination);
    }, [destination]);

    return (
        <div className="range-slider-one">
            <Range
                range
                min={0}
                max={100}
                value={[getDestination.min, getDestination.max]}
                onChange={handleOnChange}
            />
            <div className="input-outer">
                <div className="amount-outer">
                    <span className="area-amount">{getDestination.max}</span> km
                </div>
            </div>
        </div>
    );
};

export default DestinationRangeSlider;

