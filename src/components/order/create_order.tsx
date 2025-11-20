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
            .then(() => {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-2xl space-y-8">

                {/* 標題 */}
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                    建立新訂單 🛒
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* --- 動態 Items 區塊 --- */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-inner">
                        <label className="block text-lg font-bold text-gray-800 mb-4">
                            訂單內容 (Items)
                        </label>

                        {items.map((item, index) => (
                            <div key={index} className="flex gap-3 items-center mb-3">
                                {/* 商品名稱輸入框 */}
                                <input
                                    type="text"
                                    placeholder="商品名稱"
                                    className="block text-lg font-bold text-gray-800 mb-4 flex-grow w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                    required
                                />

                                {/* 數量輸入框 */}
                                <input
                                    type="number"
                                    min={1}
                                    placeholder="數量"
                                    className="block text-lg font-bold text-gray-800 mb-4 w-20 py-2 px-3 border border-gray-300 rounded-lg text-center focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                    value={item.qty}
                                    onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))}
                                    required
                                />

                                {/* 刪除按鈕 */}
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="w-8 h-8 flex items-center justify-center text-lg text-red-600 border border-red-300 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* 新增商品按鈕 */}
                        <button
                            type="button"
                            onClick={addItem}
                            className="mt-4 w-full py-2 border border-dashed border-indigo-400 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors"
                        >
                            ＋ 新增商品 (Add Item)
                        </button>
                    </div>

                    {/* --- 表單動作區塊 --- */}
                    <div className="pt-4 flex flex-col gap-3">
                        {/* 主要按鈕：送出 */}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-colors"
                        >
                            確定創建訂單 (Create Order)
                        </button>

                        {/* 次要按鈕：返回 */}
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            返回個人資料 (Back to Profile)
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateOrder;