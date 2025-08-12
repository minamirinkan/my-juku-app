import React, { useState, ChangeEvent, FormEvent } from 'react';

type Props = {
  onSearch: (keyword: string) => void;
};

const StudentSearchForm: React.FC<Props> = ({ onSearch }) => {
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(input);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="box-header with-border">
        <h3 className="box-title">検索条件の設定</h3>
      </div>

      <div className="flex space-x-4 items-center">
        <label className="font-semibold">在籍形態:</label>
        <label>
          <input type="checkbox" defaultChecked /> レギュラー
        </label>
        <label>
          <input type="checkbox" defaultChecked /> 非レギュラー
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold mb-1">生徒コード / 名前</label>
          <input
            type="text"
            placeholder="コード or 名前"
            className="w-full border rounded px-3 py-2"
            value={input}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <button type="submit" className="btn btn-primary">
          検索
        </button>
      </div>
    </form>
  );
};

export default StudentSearchForm;
