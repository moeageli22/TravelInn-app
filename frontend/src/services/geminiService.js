// Gemini API Service - Using Backend Proxy
const BACKEND_URL = 'http://localhost:5001';

export const sendMessageToGemini = async (conversationHistory) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend API Error:', errorData);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.message) {
            return data.message;
        } else {
            throw new Error('Unexpected API response format');
        }

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
};