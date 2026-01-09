export interface PrivateConversationDTO {
    userId: string;
    memberUsername?: string |undefined;
    createdBy?: string;
    memberId?:string | undefined
}
export interface createGroupConversationDTO {
    avatarLocalPath?: string | undefined;
    groupName: string;
    memberIds: string[];
    createdBy: string;

}   