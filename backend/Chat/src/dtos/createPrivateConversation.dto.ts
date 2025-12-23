export interface PrivateConversationDTO {
    userId: string;
    memberId: string;
    
}
export interface createGroupConversationDTO {
    avatarLocalPath?: string | undefined;
    groupName: string;
    memberIds: string[];
    createdBy: string;

}   