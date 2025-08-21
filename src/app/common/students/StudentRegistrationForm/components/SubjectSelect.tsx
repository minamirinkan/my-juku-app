import React from 'react';
import CreatableSelect from 'react-select/creatable';
import type { ActionMeta, OnChangeValue } from 'react-select';

type OptionType = {
    value: string;
    label: string;
};

type SubjectSelectProps = {
    value: string;
    onChange: (value: string) => void;
    subjectOptions: string[];
};

const SubjectSelect: React.FC<SubjectSelectProps> = ({ value, onChange, subjectOptions }) => {
    const options: OptionType[] = subjectOptions.map((s) => ({ value: s, label: s }));

    const handleChange = (selectedOption: OnChangeValue<OptionType, false>, _actionMeta: ActionMeta<OptionType>) => {
        onChange(selectedOption ? selectedOption.value : '');
    };

    return (
        <CreatableSelect
            isClearable
            onChange={handleChange}
            options={options}
            value={value ? { value, label: value } : null}
            placeholder="科目を選択または入力"
        />
    );
};

export default SubjectSelect;
