export interface PrivateConversationDTO {
    userId: string;
    memberId: string;
    
}
export interface createGroupConversationDTO {
    avatar?: string | undefined;
    groupName: string;
    memberIds: string[];
    createdBy: string;

}   