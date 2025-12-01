//components/order/edit_order

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
    const [status] = useState<Order["status"]>(order.status);
    const [text] = useState<React.ReactNode | null>(null);

    useEffect(() => {
        setItems(order.items);

    }, []);

    const statusColors: Record<Order['status'], string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-indigo-100 text-indigo-800',     // 新增：確認後比 pending 冷靜一點
        preparing: 'bg-purple-100 text-purple-800',     // 新增：處理中但非緊急
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">訂單詳情</h2>
                    <p className="text-sm text-gray-500 mt-1">查看訂單 #{order._id.slice(-6).toUpperCase()} 的詳細資訊</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-8">

                {/* Basic Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            訂單編號
                        </label>
                        <div className="font-mono text-gray-900 font-medium">
                            {order._id}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            客戶名稱
                        </label>
                        <div className="text-gray-900 font-medium">
                            {order.customer}
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span>📦</span> 訂單內容 ({items.length})
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 w-16 text-center">#</th>
                                    <th className="px-4 py-3">商品名稱</th>
                                    <th className="px-4 py-3 text-right">數量</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 text-center text-gray-400">{idx + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                        <td className="px-4 py-3 text-right text-gray-600">
                                            x <span className="font-bold text-blue-600">{item.qty}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Status Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-500">當前狀態</span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                    </span>
                </div>
            </div>
        </div>
    );

}

export default Detail_panel;