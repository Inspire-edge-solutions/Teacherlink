


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addKeyword } from "../../../features/filter/employerFilterSlice";
import { BsSearch } from "react-icons/bs";
const SearchBox = () => {
    const { keyword } = useSelector((state) => state.employerFilter);
    const [getKeyWord, setkeyWord] = useState(keyword);
    const dispath = useDispatch();

    // keyword handler
    const keywordHandler = (e) => {
        dispath(addKeyword(e.target.value));
    };

    useEffect(() => {
        setkeyWord(keyword);
    }, [setkeyWord, keyword]);

    return (
        <>
            <input
                type="text"
                name="listing-search"
                placeholder="Job title, keywords, or company"
                value={getKeyWord}
                onChange={keywordHandler}
            />
            <span className="icon"><BsSearch /></span>
        </>
    );
};

export default SearchBox;
