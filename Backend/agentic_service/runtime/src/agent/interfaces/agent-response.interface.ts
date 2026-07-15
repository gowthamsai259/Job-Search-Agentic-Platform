export interface AgentResponse<T = any> {

    success: boolean;

    type: string;

    data: T;

}