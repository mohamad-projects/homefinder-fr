import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {Display} from '../';
import { mostSearch, mostWatch } from '../../features/search/searchSlice';
import './MostPages.scss';
import { DarkModeContext } from '../../context/DarkModeContext';
import { getTranslations } from '../../TRANSLATIONS';

const MostPages = () => {
    const { translateMode } = useContext(DarkModeContext);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const t = getTranslations(translateMode);
    const type = location.pathname.includes('MostWatch') ? 'mostWatch' : 'mostSearch';
    
    const mostSearchData = useSelector((state) => state.search.mostSearch);
    const mostWatchData = useSelector((state) => state.search.mostWatch);
    const [currentPage, setCurrentPage] = useState(1);
    const lastPage = 10; 
    console.log(lastPage)

    useEffect(() => {
        if (type === "mostWatch") {
            dispatch(mostWatch(currentPage));
        } else {
            dispatch(mostSearch(currentPage));
        }
    }, [dispatch, type, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="most-pages-container">
            <div className="header-section">
                <h1>
                    {type === "mostWatch" 
                        ? (translateMode ? 'Most Watched Properties' : 'العقارات الأكثر مشاهدة')
                        : (translateMode ? 'Most Searched Properties' : 'العقارات الأكثر بحثاً')
                    }
                </h1>
            </div>
{/*             
            {type === "mostWatch" ? (
                <Display
                    properties={mostWatchData.data}
                    lastPage={lastPage}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    translateMode={translateMode}
                />
            ) : (
                <Display
                    properties={mostSearchData.data}
                    lastPage={lastPage}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    translateMode={translateMode}
                />
            )} */}
        </div>
    );
};

export default MostPages;