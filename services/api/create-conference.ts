import axios, {AxiosResponse} from "axios";
import {API} from "@/constants/Api";

export interface CreateConferenceRequest {
    topic: string;
};

export interface CreateConferenceResponse {
    id: string;
    topic: string;
    createdAt: string;
    updatedAt: string;
}

export const createConference = async (args: CreateConferenceRequest) => {
    return await axios.post<CreateConferenceRequest, AxiosResponse<CreateConferenceResponse>>(`${API}/conferences`, args);
}
