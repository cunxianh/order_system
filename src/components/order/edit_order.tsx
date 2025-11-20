//components/order/edit_order

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EditPanelProps {
    order: Order;
    onClose: () => void;
}

interface OrderItem {
    name: string;
    qty: number;
}

interface Order {
    _id: string;
    customer: string;
    status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled' | 'processing';
    items: OrderItem[];
    // 其他欄位...
}



const Edit_panel: React.FC<EditPanelProps> = ({ order, onClose }) => {

    // reference the props to avoid "All destructured elements are unused" compile error
    const [items, setItems] = useState<OrderItem[]>([{ name: '', qty: 1 }]);
    const [status, setStatus] = useState<Order["status"]>(order.status);
    const [text, setText] = useState<React.ReactNode | null>(null);

    const navigate = useNavigate();


    const api = useMemo(() => axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        withCredentials: true,
    }), []);

    useEffect(() => {
        setItems(order.items);

    }, []);

    const addItem = () => {
        setItems((prev) => [...prev, { name: '', qty: 1 }]);
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        console.log("items", items);
        e.preventDefault();

        const updatedData = {
            status: status,        // 使用者剛剛選的值
            items: items,
        };

        api.patch(`/orders/${order._id}`, updatedData)
            .then((res) => {

                console.log("訂單建立成功 🎉", res)
                setText(
                    <p className="p-3 text-green-700 bg-green-100 border border-green-300 rounded-lg">
                        訂單建立成功 🎉
                    </p>
                );
                navigate(0);
            })
            .catch((err) => {
                console.error(err);
                alert('伺服錯誤');

            });

    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-indigo-100 text-indigo-800',
        preparing: 'bg-purple-100 text-purple-800',
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    return (
        <div className="bg-white rounded-lg p-6 max-w-2.5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-2 flex items-center justify-between mb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">編輯訂單</h2>
                <>{text}</>
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={onClose}
                >
                    <X className="w-4 h-4 text-gray-600" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="">
                <div className="space-y-2">
                    <div className='flex items-center gap-2'>
                        <label className="block text-sm font-medium text-gray-700">
                            訂單編號
                        </label>
                        <input
                            type="text"
                            value={order._id}
                            readOnly
                            className="text-gray-700 text-sm font-medium w-80% border border-gray-300 rounded-lg bg-gray-50"
                        />

                        <label className="block text-sm font-medium text-gray-700">
                            客戶名稱
                        </label>
                        <input
                            type="text"
                            defaultValue={order.customer}
                            readOnly
                            className="text-gray-700 text-sm font-medium w-80% border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>

                    <div className='border border-gray-200 '>
                        <label className="p-4 text-1xl font-bold text-gray-800 border-b border-gray-400 block">
                            訂單
                        </label>
                        <div className='max-h-[30vh] overflow-y-auto'>
                            {items.map((item: OrderItem, idx: number) => (
                                <div key={idx} className='p-2 m-4 flex items-center gap-4 border-b border-gray-200'>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {idx}
                                    </label>
                                    <input
                                        type="text"
                                        value={item.name}
                                        className="text-gray-700 w-80% px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                                    />
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        X
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={item.qty}
                                        className="text-gray-700 w-80% px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                                    />
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="text-red-400 text"
                                        >
                                            X
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='px-6 py-4 flex items-center justify-center'>
                        <button
                            type="button"
                            onClick={addItem}
                            className="flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition"
                        >
                            <span className="text-lg font-bold">＋</span>
                            <span>Add Item</span>
                        </button>

                    </div>
                    <div className="flex items-center gap-2 justify-center">
                        <label className="block text-sm font-medium text-gray-700">
                            訂單狀態
                        </label>
                        <select
                            value={status}
                            className="backdrop-blur-md lock text-sm font-medium text-gray-700 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={(e) => setStatus(e.target.value as Order["status"])}
                        >
                            <option value="pending" className={`block text-sm font-medium text-gray-700 ${statusColors["pending"]}`}>pending</option>
                            <option value="processing" className={`block text-sm font-medium text-gray-700 ${statusColors["processing"]}`}>processing</option>
                            <option value="completed" className={`block text-sm font-medium text-gray-700 ${statusColors["completed"]}`}>completed</option>
                            <option value="cancelled" className={`block text-sm font-medium text-gray-700 ${statusColors["cancelled"]}`}>cancelled</option>
                            <option value="confirmed" className={`block text-sm font-medium text-gray-700 ${statusColors["confirmed"]}`}>confirmed</option>
                            <option value="preparing" className={`block text-sm font-medium text-gray-700 ${statusColors["preparing"]}`}>preparing</option>
                        </select>
                    </div>


                    <div className="flex gap-3 mt-6">
                        <button
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            type="submit"
                        >
                            儲存變更
                        </button>
                        <button
                            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            onClick={onClose}
                        >
                            取消
                        </button>
                    </div>

                </div>
            </form>

        </div>

    );

}

export default Edit_panel;