import React from 'react';

type InfoRowProps = {
    label: string;
    value?: string;
    name?: string;
    isEditing: boolean;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InfoRow: React.FC<InfoRowProps> = ({
    label,
    value,
    name,
    isEditing,
    readOnly = false,
    onChange,
}) => (
    <div className="flex text-sm border-b border-gray-200 py-1">
        <span className="w-32 text-gray-500">{label}</span>
        {isEditing && !readOnly ? (
            <input
                type="text"
                name={name}
                value={value || ''}
                onChange={onChange}
                className="border border-gray-300 px-2 py-0.5 rounded w-full text-gray-800"
            />
        ) : (
            <span className="text-gray-800 font-medium">{value || '－'}</span>
        )}
    </div>
);

export default InfoRow;
