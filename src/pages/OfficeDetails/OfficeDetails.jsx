import React, { useEffect } from 'react';
import './OfficeDetails.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOfficeDetails } from '../../features/office/officeSlice';

const OfficeDetails  = () => {
const { id } = useParams();
const dispatch = useDispatch();
console.log(id)
const data = useSelector((state) => state.office.officeDetails);
useEffect(()=>{
    dispatch(getOfficeDetails(id));
},[id])
  return (
    <div className="office-card">
      hi
    </div>
  );
};

export default OfficeDetails ;
