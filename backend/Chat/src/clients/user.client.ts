import axios from "axios";
import type { UserBulkResponse } from "../dtos/userDetailsSummary.dto.js";
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
    async getUserInfoClient(userIds: string[]): Promise<UserBulkResponse> {
        try {
            const response = await axios.post(`http://localhost:8000/api/v1/users/getUserInBulk`, { userIds }); 
            
            
            return response.data.data;
        } catch (error) {
            console.error("Error checking user existence:", error);
            throw new Error("Failed to check user existence");
        }
    }
    
}
