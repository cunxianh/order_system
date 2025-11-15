//components/order/create_order.tsxx
import { useState , useContext} from 'react';

import axios from 'axios';
import { AuthContext } from '../../context/auth_context';

const CreateOrder = () => {
    const authContext = useContext(AuthContext);
    const [orderData, setOrderData] = useState({ item: '', quantity: 1 });
    const [message, setMessage] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrderData({ ...orderData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        const api = axios.create({
            baseURL: import.meta.env.VITE_BACKEND_URL
        });
        e.preventDefault();
        api.post('/orders', orderData, {
            withCredentials: true,
        })
            .then((res) => {
                console.log('Order created', res.data);
                setMessage('Order created successfully!');
            })
            .catch((err) => {
                console.error(err);
                setMessage('Failed to create order. Please try again.');
            });
            
    };

    return (
        <div>
            <h2>Create Order</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Item:</label>
                    <input type="text" name="item" value={orderData.item} onChange={handleChange} required />
                </div>
                <div>
                    <label>Quantity:</label>    
                    <input type="number" name="quantity" value={orderData.quantity} onChange={handleChange} required min="1" />
                </div>
                <button type="submit">Create Order</button> 
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
export default CreateOrder;