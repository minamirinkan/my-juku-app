import React from 'react';

type BreadcrumbProps = {
    items: string[];
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [] }) => {
    return (
        <ol className="text-sm text-gray-500 flex space-x-1">
            {items.map((item, index) => (
                <li key={index} className={index === items.length - 1 ? 'text-black font-medium' : ''}>
                    {index > 0 && <span className="mx-1">{'>'}</span>}
                    <span>{item}</span>
                </li>
            ))}
        </ol>
    );
};

export default Breadcrumb;
