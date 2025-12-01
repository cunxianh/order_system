//components/order/all_order.tsx

import React, { useState, useEffect, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import Edit_panel from './edit_order';

import Detail_panel from './details_order';

import Pagination from '../../utils/pagination';

import { API } from '../../api/backend_connect';


interface OrderItem {
    name: string;
    qty: number;
}

interface Order {
    _id: string;
    customer: string;
    items: OrderItem[];
    status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled' | 'processing';
    created_at: string;
}

interface pagination_data {
    hasNextPage: boolean,
    hasPrevPage: boolean,
    limit: number,
    page: number,
    total: number,
    totalPages: number
}

const AllOrder: React.FC = () => {
    const navigate = useNavigate();
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [detailOrder, setDetailOrder] = useState<Order | null>(null);

    const [pagination_data, setPagination_data] = useState<pagination_data | null>(null);
    const handleClose = () => {
        setEditOrder(null);
        setDetailOrder(null);
    }

    const statusColors: Record<Order['status'], string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-indigo-100 text-indigo-800',     // 新增：確認後比 pending 冷靜一點
        preparing: 'bg-purple-100 text-purple-800',     // 新增：處理中但非緊急
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const [user, setuser] = useState('');

    const api = useMemo(() => API, []);
    const [orders, setOrders] = useState<Order[]>([]);

    const delete_order = (order: Order) => {
        const ok = confirm('確定要刪除訂單嗎？');
        if (!ok) return;

        api.delete(`/orders/${order._id}`)
            .then((res) => {
                console.log('已刪除訂單', res.data);
                navigate(0);
            })
            .catch((err) => {
                console.error(err);
                alert('無法刪除訂單');

            });

    }

    const pagination_item = (order: Order[]) => {
        setOrders(order);
    }

    useEffect(() => {
        // 可以在這裡檢查用戶是否已登入，或載入必要的資料
        api.get('/profile/me')
            .then((res) => {
                setuser(res.data.user.name);
            })
            .catch((err) => {
                console.error(err);
                alert('請先登入');
                navigate('/');
            });
    }, []);

    useEffect(() => {
        api.get('/orders')
            .then((res) => {
                setOrders(res.data.data as Order[]);
                setPagination_data(res.data.pagination as pagination_data);
            })
            .catch((err) => {
                console.error(err);
                alert('無法載入訂單資料，請稍後再試。');
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/80">
            {/* Header - 手機時變成漢堡選單風格 */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm text-lg">
                                📦
                            </div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                                訂單管理系統
                            </h1>
                        </div>

                        {/* 手機隱藏按鈕，改用右上角返回箭頭 */}
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 sm:px-4"
                        >
                            <span className="text-lg">←</span>
                            <span className="hidden sm:inline">返回個人資料</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* 標題區 - 手機變直式 */}
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                                    所有訂單
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                        {orders.length} 筆
                                    </span>
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 hidden sm:block">
                                    查看並管理您的客戶訂單與狀態
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 表格 - 手機變成卡片式！ */}
                    <div className="overflow-x-auto">
                        {/* 大螢幕：傳統表格 */}
                        <table className="w-full text-left border-collapse hidden md:table">
                            <thead>
                                <tr className="bg-gray-50 border-b-2 border-gray-200 text-xs uppercase text-gray-600 font-bold tracking-wider">
                                    <th className="px-6 py-4 text-left">訂單 ID</th>
                                    <th className="px-6 py-4 text-left">客戶</th>
                                    <th className="px-6 py-4 text-left">商品</th>
                                    <th className="px-6 py-4 text-left">時間</th>
                                    <th className="px-6 py-4 text-left">狀態</th>
                                    <th className="px-6 py-4 text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">

                                        <td className="px-6 py-4">
                                            <a href="#" onClick={(e) => { e.preventDefault(); setDetailOrder(order); }}
                                                className="font-mono text-blue-600 hover:underline"># {order._id.slice(-6).toUpperCase()}</a>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shadow-inner">
                                                    {order.customer.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900 text-sm">{order.customer}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="flex flex-wrap gap-1.5">
                                                {order.items.slice(0, 3).map((item: any, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                        {item.name} ×{item.qty}
                                                    </span>
                                                ))}
                                                {order.items.length > 3 && <span className="text-xs text-gray-500">+{order.items.length - 3}</span>}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            {user === order.customer && (
                                                <div className="flex justify-end gap-4">
                                                    <button onClick={() => setEditOrder(order)} className="hover:cursor-pointer text-indigo-600 hover:text-indigo-800 hover:underline font-medium">編輯</button>
                                                    <button onClick={() => delete_order(order)} className="hover:cursor-pointer text-red-600 hover:text-red-800 hover:underline font-medium">刪除</button>
                                                </div>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* 手機版：卡片式列表 */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {orders.map((order) => (
                                <div key={order._id} className="p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <a href="#" onClick={(e) => { e.preventDefault(); setDetailOrder(order); }}
                                            className="font-mono text-lg font-bold text-blue-600"># {order._id.slice(-6).toUpperCase()}</a>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                                {order.customer[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{order.customer}</p>
                                                <p className="text-gray-500">{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-gray-600 font-medium mb-1">商品：</p>
                                            <div className="flex flex-wrap gap-2">
                                                {order.items.map((item: any, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                        {item.name} ×{item.qty}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {user === order.customer && (
                                            <div className="flex gap-4 pt-2">
                                                <button onClick={() => setEditOrder(order)} className="hover:cursor-pointer text-indigo-600 font-medium">編輯訂單</button>
                                                <button onClick={() => delete_order(order)} className="hover:cursor-pointer text-red-600 font-medium">刪除</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 空狀態 */}
                    {orders.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500">目前沒有任何訂單喔～</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals - 保持邏輯不變，僅微調背景遮罩樣式 */}
            {editOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                        onClick={() => handleClose()}
                    />
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative transform transition-all w-full max-w-lg">
                            <Edit_panel order={editOrder} onClose={handleClose} />
                        </div>
                    </div>
                </div>
            )}

            {detailOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                        onClick={() => handleClose()}
                    />
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative transform transition-all w-full max-w-2xl">
                            <Detail_panel order={detailOrder} onClose={handleClose} />
                        </div>
                    </div>
                </div>
            )}

            {pagination_data && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-8">
                    <Pagination pagination={pagination_data} order_data={pagination_item} />
                </div>
            )}
        </div>
    );
}
export default AllOrder;