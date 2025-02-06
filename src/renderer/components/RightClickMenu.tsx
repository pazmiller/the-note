// src/renderer/components/RightClickMenu.tsx
import React from 'react'

interface Props {
  x: number
  y: number
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

const RightClickMenu: React.FC<Props> = ({ x, y, onClose, onEdit, onDelete }) => {
    return (
        <div
            className="absolute bg-white shadow-lg rounded-md z-50"
            style={{ left:x, top: y }}
            onMouseLeave={onClose}
            >
                <ul className="p-2">
                    <li className="cursor-pointer px-4 py-2 hover:bg-gray-200" 
                        onClick={onEdit}>
                        Edit
                    </li>
                    <li className="cursor-pointer px-4 py-2 hover:bg-gray-200" 
                        onClick={onDelete}>
                        Delete
                    </li>
                </ul>
        </div>
    )
}

export default RightClickMenu