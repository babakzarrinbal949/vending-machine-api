import React, { useState, useEffect } from 'react';
import {fetchProducts, makePurchase} from "../api";
import ProductModal from "./ProductModal";

function Home() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const token = localStorage.getItem('access-token');
    const [buySuccess, setBuySuccess] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchProductsData() {
            try {
                const fetchedProducts = await fetchProducts();
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProductsData();
    }, []);

    const handlePurchase = async (productId, quantity) => {
        try {
            const response = await makePurchase(productId, quantity, token);
            setBuySuccess(response.ok);
            setMessage(response.body.message);
        } catch (error) {
            console.error('Purchase failed:', error);
        }
    };

    return (
        <div className="container">
            <h2>Available Products</h2>
            <div className="row">
                {products && products.length === 0 &&
                    (
                        <p className='alert alert-info'>No product is available</p>
                    )
                }
                {products.map(product => (
                    <div key={product.id} className="col-md-4">
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">{product.productName}</h5>
                                <p className="card-text">Cost: {product.cost} cents</p>
                                <p className="card-text">Available: {product.amountAvailable}</p>
                                {token && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        Buy
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    show={true}
                    onHide={() => setSelectedProduct(null)}
                    onPurchase={handlePurchase}
                    message={message}
                    success={buySuccess}
                />
            )}
        </div>
    );
}

export default Home;