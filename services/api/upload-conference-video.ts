import axios from "axios";
import {API} from "@/constants/Api";

export interface CreateConferenceVideoRequest {
    videoUri: string;
    conferenceId: string;
};

export const uploadConferenceVideo = async (args: CreateConferenceVideoRequest) => {
    const formData = new FormData();

    // @ts-ignore
    formData.append('file', {
        uri: args.videoUri,
        type: 'video/mp4',
        name: 'video.mp4',
    });

    try {
        return await axios.post<CreateConferenceVideoRequest>(`${API}/conferences/${args.conferenceId}/video`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    } catch (e) {
        console.error(JSON.stringify(e));
    }
}
