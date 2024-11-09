import React from "react";
import {useNavigate} from "react-router-dom";
import {currencyFormat} from "../../../utils/number";
import CloseIcon from "./CloseIcon";
import {right} from "@cloudinary/url-gen/qualifiers/textAlignment";
import {useDispatch} from "react-redux";
import {deleteWishProduct} from "../../../features/product/productSlice";

const ProductCard = ({item}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const deleteProduct = (id) => {
    dispatch(deleteWishProduct({id: id}));
  };

  return (
    <div>
      <div style={{float: 'right'}} onClick={() => {
        deleteProduct(item._id);
      }}>
        <CloseIcon />
      </div>
      <div className="card" onClick={() => showProduct(item._id)}>
        <img src={item?.image} alt={item?.image}/>
        <div>{item?.name}</div>
        <div>₩ {currencyFormat(item?.price)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
