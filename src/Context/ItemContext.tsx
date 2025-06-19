import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface Item {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface ItemContextType {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  addItem: (item: Item) => void;
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const ItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const addItem = (item: Item) => {
    setItems((prev) => [...prev, item]);
  };

  return (
    <ItemContext.Provider
      value={{ items, setItems, addItem, selectedItem, setSelectedItem }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItemContext = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItemContext must be used within an ItemProvider");
  }
  return context;
};
