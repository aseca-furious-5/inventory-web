import axios from "axios";
import {INVENTORY_API_URL} from "./constant";

export const getAllItemInventories = async () => {
    try{
        const response = await axios.get(`${INVENTORY_API_URL}/item/all`);
        return response.data;
    } catch (error){
        console.error("Error while fetching items", error);
    }
};

export const adjustItemInventory = async (itemId, adjustment, reason) => {
    try {
        const response = await axios.post(
            `${INVENTORY_API_URL}/item/adjust`,
            { itemId, amount: adjustment, reason}
        );
        return response.data;
    } catch (error) {
        console.error("Error while adjusting item inventory", error);
    }
}

export const getAdjustmentsForItem = async (itemId) => {
    try {
        const response = await axios.get(`${INVENTORY_API_URL}/item/adjustments/${itemId}`);
        return response.data;
    } catch (error) {
        console.error("Error while fetching adjustments", error);
    }
};