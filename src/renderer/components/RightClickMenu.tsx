// src/renderer/components/RightClickMenu.tsx
import React from 'react'

interface Props
{
    x: number
    y: number
    onClose: () => void
    onEdit: () => void
    onDelete: () => void
}

// 改进右键菜单组件
const RightClickMenu: React.FC<Props> = ( { x, y, onClose, onEdit, onDelete } ) =>
{
    return (
        <div
            className="absolute bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700"
            style={{ left: x, top: y }}
            onMouseLeave={onClose}
        >
            <ul className="py-1">
                <li
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-gray-700 dark:text-gray-200 cursor-pointer"
                    onClick={onEdit}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                </li>
                <li
                    className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900 flex items-center text-red-600 dark:text-red-400 cursor-pointer"
                    onClick={onDelete}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                </li>
            </ul>
        </div>
    );
};

export default RightClickMenu