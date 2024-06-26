import './App.css';
import { useEffect, useState } from "react";
import { adjustItemInventory, getAdjustmentsForItem, getAllItemInventories } from "./service";

function App() {
    const [items, setItems] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [reason, setReason] = useState('');
    const [showAdjustments, setShowAdjustments] = useState(null);
    const [adjustments, setAdjustments] = useState([]);

    const THRESHOLD = 10;

    useEffect(() => {
        getAllItemInventories().then((response) => {
            setItems(response);
        });
    }, []);

    const handleEdit = (item) => {
        setEditItem(item);
        setInputValue('');
        setReason('');
    };

    const handleSave = async (itemToSave) => {
        const newQuantity = parseInt(inputValue, 10);
        if (!isNaN(newQuantity)) {
            setItems(items.map(item =>
                item.id === itemToSave.id ? { ...item, quantity: item.quantity + newQuantity } : item
            ));
            setEditItem(null);
            setShowAdjustments(null);
            await adjustItemInventory(itemToSave.itemId, newQuantity, reason);
        }
    };

    const handleShowAdjustments = async (id) => {
        setShowAdjustments(showAdjustments === id ? null : id);
        setAdjustments(await getAdjustmentsForItem(id));
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Inventory App</h1>
            </header>
            <div>
                <h1>Item List</h1>
                <ul>
                    {items && items.length !== 0 ? items.map(item => (
                            <li key={item.id} style={{ marginBottom: 40 }}>
                                {item.name} - Quantity: {item.quantity} {item.quantity < THRESHOLD && <span style={{ fontWeight: 'bold', position: 'absolute', right: '20px' }}> ⚠️ Low Stock</span>}
                                <br></br>
                                <button style={{ marginLeft: 10 }} onClick={() => handleEdit(item)}>Update Quantity</button>
                                <button onClick={() => handleShowAdjustments(item.id)}>
                                    {showAdjustments === item.id ? 'Hide' : 'Show'} Adjustments
                                </button>
                                {editItem && editItem.id === item.id && (
                                    <div style={{ marginTop: 10 }}>
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Enter reason"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                        <button onClick={() => handleSave(item)}>Save</button>
                                    </div>
                                )}
                                {showAdjustments === item.id && (
                                    <ol>
                                        {adjustments.map((adjustment, index) => (
                                            <li key={index}>
                                                Quantity Change: {adjustment.amount}, Reason: {adjustment.reason}
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </li>
                        ))
                        :
                        <h2>Something went wrong</h2>
                    }
                </ul>
            </div>
        </div>
    );
}

export default App;
