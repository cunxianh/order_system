//components/order/all_order.tsx

import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/auth_context';

import { useNavigate } from 'react-router-dom';

import Edit_panel from './edit_order';

import Detail_panel from './details_order';

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

const AllOrder: React.FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [detailOrder, setDetailOrder] = useState<Order | null>(null);

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
    if (!authContext) throw new Error('AuthContext must be used within AuthProvider');

    const api = useMemo(() => axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        withCredentials: true,
    }), []);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // 可以在這裡檢查用戶是否已登入，或載入必要的資料
        api.get('/profile/me')
            .then((res) => {
                console.log('已登入', res.data);
                setuser(res.data.user.name);
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
                setOrders(res.data.data as Order[]);

            })
            .catch((err) => {
                console.error(err);
                alert('無法載入訂單資料，請稍後再試。');
            });
    }, [api, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div>
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">訂單管理系統</h1>

                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="mr-4 mt-2 bg-gray-300 text-gray-700 hover:bg-gray-500 hover:text-gray-900 font-medium px-4 py-2 rounded transition-colors duration-200"
                        >
                            Back to Profile
                        </button>

                        <button
                            className='px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-500 hover:text-gray-900 transition-colors duration-200'
                        >
                            個人訂單
                        </button>

                    </div>
                </header>



            </div>
            {/* 主要內容區 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-lg font-semibold text-gray-800">所有訂單</h1>
                    </div>
                </div>
                <div>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訂單ID</th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客戶名稱</th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品列表</th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">建立時間</th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <a href='#' onClick={(e) => {
                                            e.preventDefault();
                                            setDetailOrder(order);

                                        }}>
                                            {order._id}
                                        </a>


                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div>
                                            {order.items.map((item: any, index: number) => (
                                                <div key={item.id ?? index} className="mb-1">
                                                    {item.name} x {item.qty}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(order.created_at).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    {user === order.customer && (
                                        <>
                                            <td className="px-2 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => setEditOrder(order)}
                                                    className="bg-blue-100 px-3 py-1.5 border border-blue-300 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200"
                                                >
                                                    編輯
                                                </button>

                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    //onClick={() => removeItem(index)}
                                                    className="text-red-400 hover:text-red-900 font-medium px-2 py-1 rounded transition-colors duration-200"
                                                >
                                                    X
                                                </button>
                                            </td>
                                        </>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            {editOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto ">
                    <div
                        className="backdrop-blur-md fixed inset-0 bg-black/80"
                        onClick={() => handleClose()}
                    />
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative">
                            <Edit_panel
                                order={editOrder}
                                onClose={handleClose}
                            />
                        </div>

                    </div>

                </div>
            )}

            {detailOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto ">
                    <div
                        className="backdrop-blur-md fixed inset-0 bg-black/80"
                        onClick={() => handleClose()}
                    />
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative">
                            <Detail_panel
                                order={detailOrder}
                                onClose={handleClose}
                            />
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}
export default AllOrder;