"use client";

import axios from 'axios';
import React, { useState, useEffect } from 'react'

function Product() {
const[product, setProduct] = useState(null);
const[loading, setLoading] = useState(false);
const[error, setError] = useState(null);

    useEffect(()=>{
        const fetchProduct = async() =>{
            try{
                const response = await axios.get(`/api/store/products/${id}`);
                const res = response.data;
                setProduct(res);
                console.log(res);
            }
            catch(err){
                console.error("Error", err);
            }
        }
    },[])

    if(loading) return <p className='text-white text-xl text-center'>Loading...</p>
    if(error) return <p className='text-red-700 text-center text-xl'>{err}</p>
  return (
    <>
        <div> 
           <img src={product.imageUrl} alt={product.name}/>
        </div>
    </>
  )
}

export default Product
