import axios, {AxiosResponse} from "axios";
import {API} from "@/constants/Api";

export interface GetConferencesResponse {
    id: string,
    videoId: string | null,
    topic: string,
    tags: string | null,
    createdAt: string,
    updatedAt: string,
}

export const getConferences = async () => {
    return await axios.get<undefined, AxiosResponse<GetConferencesResponse[]>>(`${API}/conferences`);
};
