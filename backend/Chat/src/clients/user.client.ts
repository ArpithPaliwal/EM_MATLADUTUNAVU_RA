import axios from "axios";

export class UserClient {
    async checkUserExists(userId: string): Promise<boolean> {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/users/userExists/${userId}`); 
            
            
            return response.data.data;
        } catch (error) {
            console.error("Error checking user existence:", error);
            throw new Error("Failed to check user existence");
        }
    }
}