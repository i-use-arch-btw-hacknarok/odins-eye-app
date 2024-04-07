import {FaceDetail} from "@aws-sdk/client-rekognition";

const weights = {
    EyesOpen: 0.4,
    EyeDirection: 0.1,
    MouthOpen: 0.1,
    Smile: 0.1,
    PosePitch: 0,
    PoseYaw: 0,
    PoseRoll: 0,
    Calm: 0.4,
    Sad: 0.2,
    Confused: 0,
    Angry: 0,
    Disgusted: 0,
    Fear: 0,
    Happy: 0,
    Surprised: 0,
} as const;

export const transformInRange = (x: number, from: [number, number], to: [number, number]) => {
    const fromMin = from[0],
        fromMax = from[1],
        toMin = to[0],
        toMax = to[1];

    return ((x - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
};


// const FOCUSED_EMOTIONS = ['HAPPY', 'ANGRY', 'CONFUSED', 'DISGUSTED', ];
// const NOT_FOCUSED_EMOTIONS = ['CALM', 'SAD', 'SURPRISED', 'FEAR'];

const toStudlyCase = (str: string) => {
    if (str.length === 0) return str;

    return str.at(0)?.toUpperCase() + str.slice(1).toLowerCase();
}

export const calculateAttention = (emotions: FaceDetail) => {
    return Object.entries(emotions).reduce((acc, [key, value]) => {
        if (key === 'EyesOpen' || key === 'MouthOpen' || key === 'Smile') {
            const factor = value.Value ? 1 : 0.05;
            acc += value.Confidence * weights[key] * factor;
        } else if (key === 'EyeDirection') {
            acc += (1 - transformInRange(Math.abs(value.Yaw) + Math.abs(value.Pitch), [0, 45], [0, 1])) * weights.EyeDirection * value.Confidence;
        } else if (key === 'Pose') {
            acc += transformInRange(value.Pitch, [-90, 90], [0, 1]) * weights.PosePitch;
            acc += transformInRange(value.Yaw, [-90, 90], [0, 1]) * weights.PoseYaw;
            acc += transformInRange(value.Roll, [-90, 90], [0, 1]) * weights.PoseRoll;
        } else if (key === 'Emotions') {
            for (const emotion of value) {
                const key = toStudlyCase(emotion.Type) as keyof typeof weights;
                const factor = 1; // FOCUSED_EMOTIONS.includes(key.toUpperCase()) ? 1 : -1;
                acc += emotion.Confidence * weights[key] * factor;
            }
        }
        return acc;
    }, 0);
}
