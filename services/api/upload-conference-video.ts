import axios from "axios";
import {API} from "@/constants/Api";

export interface CreateConferenceVideoArgs {
    videoUri: string;
    conferenceId: string;
};

export const uploadConferenceVideo = async (args: CreateConferenceVideoArgs) => {
    const formData = new FormData();

    // @ts-ignore
    formData.append('file', {
        uri: args.videoUri,
        type: 'video/mp4',
        name: 'video.mp4',
    });

    try {
        return await axios.post<CreateConferenceVideoArgs>(`${API}/conferences/${args.conferenceId}/video`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    } catch (e) {
        console.error(JSON.stringify(e));
    }
}
