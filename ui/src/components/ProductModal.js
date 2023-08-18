import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ProductModal({ product, show, onHide, onPurchase, success, message }) {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value, 10);
        setQuantity(newQuantity > product.amountAvailable ? product.amountAvailable : newQuantity);
    };

    const handlePurchase = () => {
        onPurchase(product._id, quantity);
        // onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{product.productName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && message.trim() !== '' &&
                    (<p className={`alert alert-${success ? 'success' : 'danger'}`}>{message}</p>)
                }
                <p>Cost: {product.cost} cents</p>
                <p>Available: {product.amountAvailable}</p>
                <label>
                    Quantity:
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min={1}
                        max={product.amountAvailable}
                    />
                </label>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handlePurchase}>
                    Confirm Purchase
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductModal;
