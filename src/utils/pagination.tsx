//utils/pagination.tsx

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import axios from 'axios';


interface pagination_data {
    hasNextPage: boolean,
    hasPrevPage: boolean,
    limit: number,
    page: number,
    total: number,
    totalPages: number
}

interface PaginationProps {
    pagination: pagination_data;
    order_data: (order: Order[]) => void;
}

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


const Pagination: React.FC<PaginationProps> = ({ pagination, order_data }) => {

    //console.log("pagination", pagination);
    const page = pagination.page || 1;
    const limit = pagination.limit || 5;
    const totalPages = pagination.totalPages || 0;

    //console.log("totalPages", totalPages)

    const [currentPage, setCurrentPage] = useState(page);
    const [itemsPerPage] = useState(limit);

    const api = useMemo(() => axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        withCredentials: true,
    }), []);

    // 生成頁碼按鈕
    const getPageNumbers = (): (number | string)[] => {
        const pages = [];
        const maxVisible: number = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            api.get(`/orders?page=${page}&limit=${limit}`)
                .then((res) => {
                    console.log('分頁資料', res.data.data);
                    console.log(typeof order_data)
                    if (order_data && typeof order_data === 'function') {
                        order_data(res.data.data);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    alert('無法載入訂單資料，請稍後再試。');
                });

        }
    };

    const pageNumbers: (number | string)[] = getPageNumbers();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const page: number = parseInt(e.target.value);
        if (page) goToPage(page);
    };
    return (
    <>
        {/* 資訊列 */}
        <div className="text-center text-sm text-gray-600 mb-4">
            顯示 {(currentPage - 1) * itemsPerPage + 1} 到{' '}
            {Math.min(currentPage * itemsPerPage, pagination.total)} 項，
            共 {pagination.total} 項
        </div>

        {/* 分頁主體 */}
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">

                {/* 第一頁按鈕 */}
                <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
                    title="第一頁"
                    aria-label="第一頁"
                >
                    <ChevronsLeft size={20} />
                </button>

                {/* 上一頁按鈕 */}
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
                    title="上一頁"
                    aria-label="上一頁"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* 數字按鈕列表 */}
                {pageNumbers.map((page, index) =>
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => goToPage(page as number)}
                            // v4 最佳實踐：透過 aria-current 控制樣式，移除 className 中的三元運算子
                            aria-current={currentPage === page ? 'page' : undefined}
                            className="
                                min-w-10 px-3 py-2 rounded-md border transition-colors
                                border-gray-300 text-gray-700 hover:bg-gray-50
                                aria-[current=page]:bg-blue-600 
                                aria-[current=page]:text-white 
                                aria-[current=page]:border-blue-600 
                                aria-[current=page]:font-semibold
                                aria-[current=page]:hover:bg-blue-700
                            "
                        >
                            {page}
                        </button>
                    )
                )}

                {/* 下一頁按鈕 */}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
                    title="下一頁"
                    aria-label="下一頁"
                >
                    <ChevronRight size={20} />
                </button>

                {/* 最後一頁按鈕 */}
                <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
                    title="最後一頁"
                    aria-label="最後一頁"
                >
                    <ChevronsRight size={20} />
                </button>
            </div>

            {/* 跳轉到指定頁 */}
            <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-sm text-gray-600">跳轉到</span>
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={handleInputChange}
                    // v4 中 ring 仍然有效，這裡保持原樣，亦可改用 focus:outline-blue-500
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="頁碼輸入"
                />
                <span className="text-sm text-gray-600">頁</span>
            </div>
        </div>
    </>
);
}

export default Pagination;