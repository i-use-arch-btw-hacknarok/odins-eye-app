import axios, {AxiosResponse} from "axios";
import {API} from "@/constants/Api";

export interface CreateConferenceArgs {
    topic: string;
};

export interface CreateConferenceResponse {
    id: string;
    topic: string;
    createdAt: string;
    updatedAt: string;
}

export const createConference = async (args: CreateConferenceArgs) => {
    return await axios.post<CreateConferenceArgs, AxiosResponse<CreateConferenceResponse>>(`${API}/conferences`, args);
}
