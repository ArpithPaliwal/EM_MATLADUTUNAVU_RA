import axios from "axios";

export class UserClient {
    async checkUserExists(userId: string): Promise<boolean> {
        try {
            const response = await axios.get(`http://user-service/api/users/${userId}/exists`); 
            return response.data.exists;
        } catch (error) {
            console.error("Error checking user existence:", error);
            throw new Error("Failed to check user existence");
        }
    }
}