import {RekognitionClient, DetectFacesCommand, StartFaceDetectionCommand, GetFaceDetectionCommand} from "@aws-sdk/client-rekognition";

const client = new RekognitionClient({
    region: 'eu-central-1',
    credentials: {
        accessKeyId: process.env.EXPO_PUBLIC_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.EXPO_PUBLIC_SECRET_ACCESS_KEY as string,
    }
});

export const detectFaces = async (image: Buffer) => {
    // StartFaceDetectionCommand
    // GetFaceDetectionCommand
    const command = new DetectFacesCommand({
        Image: {
            Bytes: image,
        },
        Attributes: ["EMOTIONS", "EYES_OPEN", "EYE_DIRECTION", "MOUTH_OPEN", "SMILE"],
    });

    return client.send(command);
}
