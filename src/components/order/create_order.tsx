// components/order/create_order.tsx
import React, { useState, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/auth_context';
import { useNavigate } from 'react-router-dom';

type Item = {
    name: string;
    qty: number;
};

const CreateOrder: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
   


    if (!authContext) throw new Error('AuthContext must be used within AuthProvider');

    const api = useMemo(() => axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        withCredentials: true,
    }), []);

    const [customer, setCustomer] = useState<string>('');

    // Form state
    const [items, setItems] = useState<Item[]>([{ name: '', qty: 1 }]);

    useEffect(() => {
        // 可以在這裡檢查用戶是否已登入，或載入必要的資料
        api.get('/profile/me')
            .then((res) => {
                console.log('已登入', res.data);
                setCustomer(res.data.user.name);
            })
            .catch((err) => {
                console.error(err);
                alert('請先登入');
                navigate('/');
            });
    }, [api, navigate]);

    useEffect(() => {
        api.get('/orders')
            .then((res) => {
                console.log('訂單資料', res.data);
            })
            .catch((err) => {
                console.error(err);
                alert('無法載入訂單資料，請稍後再試。');
            });
    }, [api]);

    const handleItemChange = (index: number, field: keyof Item, value: string | number) => {

        setItems((prev) => {
            const updated = [...prev];
            if (field === 'qty') {
                updated[index][field] = Number(value) as any;
            } else {
                updated[index][field] = String(value) as any;
            }
            return updated;
        });
    };

    const addItem = () => {
        setItems((prev) => [...prev, { name: '', qty: 1 }]);
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const removeAllItems = () => {
        setItems([]);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const orderData = { customer, items };

        console.log('Send to backend:', orderData);

        // Example POST (uncomment if backend endpoint exists)
        // api.post('/orders', orderData).then(...).catch(...);

        api.post('/orders', orderData)
            .then((res) => {
                alert('訂單建立成功 🎉');
                removeAllItems();
                addItem();
            })
            .catch((err) => {
                console.error(err);
                alert('訂單建立失敗，請稍後再試。');
            });

    };

    return (
        <div className="">
            <h2 className="">Create Order</h2>

            <form onSubmit={handleSubmit} className="">

                {/* 動態 Items */}
                <div>
                    <label className="">Items</label>

                    {items.map((item, index) => (
                        <div key={index} className="">
                            <input
                                type="text"
                                placeholder="Item name"
                                className=""
                                value={item.name}
                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                required
                            />

                            <input
                                type="number"
                                min={1}
                                className=""
                                value={item.qty}
                                onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))}
                                required
                            />

                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className=""
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addItem}
                        className=""
                    >
                        ＋ Add Item
                    </button>
                </div>

                {/* 送出 */}
                <button
                    type="submit"
                    className=""
                >
                    Create Order
                </button>


                <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className=""
                >
                    Back to Profile
                </button>

            </form>
        </div>
    );
};

export default CreateOrder;