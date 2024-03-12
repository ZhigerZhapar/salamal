import React, { useEffect, useState } from 'react';
import cl from './SubPlaces.module.css';
import MySelectedButton from '../UI/MySelectedButton/MySelectedButton.jsx';
import { useFetch } from '../../../../components/hooks/useFetchB.js';
import axios from 'axios';
import {useDispatch} from "react-redux";
import {setSelectedSubcategory} from "../../../../actions.js";

const SubPlaces = ({ activeCategory, subcategoryId }) => {
    console.log('subcategoryid ' + subcategoryId)
    const [selectedButton, setSelectedButton] = useState(null);
    const [data, setData] = useState([]);
    const [fetching, isDataLoading, dataError] = useFetch(async () => {
        const response = await axios.get(
            `https://places-test-api.danya.tech/api/sub-categories/${subcategoryId}?populate=subsubcategories,subsubcategories.image`
        );
        setData(response.data || []);
        return response;
    });


    useEffect(() => {
        fetching();
    }, [activeCategory]);

    const dispatch = useDispatch()
    const handleButtonClick = (subcategory,index) => {
        dispatch(setSelectedSubcategory(subcategory));

        // Если кнопка уже была активной, то снимаем активность (устанавливаем null),
        // в противном случае, устанавливаем активную кнопку.
        setSelectedButton((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className={cl.button__selectd}>
            <div className={cl.button_select_rowd}>
                {Array.isArray(data.subsubcategories) && data.subsubcategories.length > 0 &&
                    // Если есть подподкатегории, маппим их
                    data.subsubcategories.map((item, index) => (
                        <MySelectedButton
                            key={index}
                            onClick={() => handleButtonClick(item.id,index)}
                            isRed={selectedButton === index}
                        >
                            <img
                                className={cl.button__image}
                                src={`https://places-test-api.danya.tech${item?.image?.data?.attributes?.url}`}
                                alt={`Изображение ${index}`}
                            />
                        </MySelectedButton>
                    )
                )}
            </div>
        </div>
    );
};

export default SubPlaces;
