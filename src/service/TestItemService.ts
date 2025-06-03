import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/test-items';

export interface TestItem {
    id: number;
    question: string;
    options: string[];
    answer: string;
    filledInfo?: any; // Puedes ajustar el tipo según la información que se llena
}

// Obtener todos los ítems desde el backend
export const fetchTestItems = async (): Promise<TestItem[]> => {
    const response = await axios.get<TestItem[]>(API_BASE_URL);
    return response.data;
};

// Guardar la información llenada de un ítem
export const saveTestItemInfo = async (itemId: number, filledInfo: any): Promise<void> => {
    await axios.put(`${API_BASE_URL}/${itemId}`, { filledInfo });
};
        