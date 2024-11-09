import React, {useEffect} from "react";
import ProductCard from "./components/ProductCard";
import {Row, Col, Container, Spinner} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {getWishList} from "../../features/product/productSlice";
import {ColorRing} from "react-loader-spinner";

const WishListPage = () => {
  const dispatch = useDispatch();
  const {loading, wishList} = useSelector((state) => state.product);
  console.log('wishList ==> ', wishList);
  useEffect(() => {
    dispatch(
      getWishList({})
    );
  }, []);

  if (loading) {
    return (
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );
  }

  return (
    <Container>
      <Row>
        {wishList.length > 0 ? (
          wishList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <div>
                <ProductCard item={item}/>
              </div>
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            <h1>관심상품이 없습니다.</h1>
          </div>
        )}
      </Row>
    </Container>
  );
};

export default WishListPage;
