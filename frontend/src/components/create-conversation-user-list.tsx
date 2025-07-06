import { useState } from 'react';

const USERNAME_REGEX = /^[a-z0-9_]{0,32}$/;
const MIN_USERNAME_LENGTH = 3;

const SelectedItemsInput = ({
  selectedItems,
  setSelectedItems,
}: {
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = (item: string) => {
    if (item && !selectedItems.includes(item) && item.length >= MIN_USERNAME_LENGTH) {
      setSelectedItems([...selectedItems, item]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setSelectedItems(selectedItems.filter((item) => item !== itemToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      handleAddItem(inputValue.trim());
    } else if (e.key === 'Backspace' && inputValue === '' && selectedItems.length > 0) {
      handleRemoveItem(selectedItems[selectedItems.length - 1]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (USERNAME_REGEX.test(value)) {
      setInputValue(value);
    }
  };

  return (
    <div className="bg-input/30 border-input focus-within:border-ring focus-within:ring-ring/50 flex min-h-[40px] flex-wrap items-center gap-2 rounded-lg border p-2 text-sm transition-all duration-200 focus-within:ring-[3px]">
      {selectedItems.map((item) => (
        <span
          key={item}
          className="bg-accent hover:bg-accent/50 flex cursor-pointer items-center rounded-full px-3 py-1 text-sm text-white transition-colors duration-200"
          onClick={() => handleRemoveItem(item)}
        >
          {item}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1.5 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      ))}
      <input
        type="text"
        className="placeholder-text-muted-foreground min-w-[100px] flex-grow bg-transparent p-1 text-white outline-none"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={selectedItems.length === 0 ? 'Type to add users...' : ''}
      />
    </div>
  );
};

export default SelectedItemsInput;
