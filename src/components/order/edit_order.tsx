//components/order/edit_order

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { X, Trash2 } from 'lucide-react';
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


    return (
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">編輯訂單</h2>
                    {text && <div className="text-sm text-red-500 mt-1">{text}</div>}
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-8 flex-1">

                    {/* Top Row: Read-only Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">訂單編號</label>
                            <input
                                type="text"
                                value={order._id}
                                readOnly
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm focus:outline-none cursor-not-allowed font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">客戶名稱</label>
                            <input
                                type="text"
                                defaultValue={order.customer}
                                readOnly
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm focus:outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Items Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-gray-900">商品清單</label>
                            <span className="text-xs text-gray-500">共 {items.length} 項商品</span>
                        </div>

                        <div className="space-y-3">
                            {items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-3 group">
                                    <div className="flex items-center justify-center w-8 h-10 text-gray-400 text-sm font-medium pt-1">
                                        {idx + 1}.
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={item.name}
                                            placeholder="商品名稱"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-300"
                                            onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.qty}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                                        />
                                    </div>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="刪除"
                                        >
                                            <Trash2 className="w-4 h-4" /> {/* 或用文字 '✕' */}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addItem}
                            className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span>＋ 新增商品</span>
                        </button>
                    </div>

                    {/* Status Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            訂單狀態
                        </label>
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Order["status"])}
                                className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="preparing">Preparing</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
                    >
                        {/* <Save className="w-4 h-4" /> */}
                        儲存變更
                    </button>
                </div>
            </form>
        </div>
    );

}

export default Edit_panel;