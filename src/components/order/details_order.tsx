//components/order/edit_order

import React, { useState, useContext, useEffect, useMemo } from 'react';
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



const Detail_panel: React.FC<EditPanelProps> = ({ order, onClose }) => {

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

    const statusColors: Record<Order['status'], string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-indigo-100 text-indigo-800',     // 新增：確認後比 pending 冷靜一點
        preparing: 'bg-purple-100 text-purple-800',     // 新增：處理中但非緊急
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white rounded-lg p-6 max-w-2.5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-2 flex items-center justify-between mb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">訂單預覽</h2>
                <>{text}</>
                <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={onClose}
                >
                    <X className="w-4 h-4 text-gray-600" />
                </button>
            </div>

                <div className="space-y-2">
                    <div className='flex items-center gap-2'>
                        <label className="block text-sm font-medium text-gray-700">
                            訂單編號
                        </label>
                        <input
                            type="text"
                            value={order._id}
                            readOnly
                            className="text-gray-700 text-sm font-medium w-80% border border-gray-300 rounded-lg bg-gray-200"
                        />

                        <label className="block text-sm font-medium text-gray-700">
                            客戶名稱
                        </label>
                        <input
                            type="text"
                            defaultValue={order.customer}
                            readOnly
                            className="text-gray-700 text-sm font-medium w-80% border border-gray-300 rounded-lg bg-gray-200"
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
                                        readOnly
                                        className="text-gray-700 text-sm font-medium w-80% border border-gray-300 rounded-lg bg-gray-200"
                                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                                    />
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        X
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        readOnly
                                        value={item.qty}
                                        className="text-gray-700 text-sm font-medium w-80% border border-gray-300 rounded-lg bg-gray-200"
                                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                                    />

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                        <label className="block text-sm font-medium text-gray-700">
                            訂單狀態:  
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
                                {status}
                            </span>
                        </label>
                    </div>

                </div>
            
        </div>

    );

}

export default Detail_panel;