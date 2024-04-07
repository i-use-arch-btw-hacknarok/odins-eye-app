import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from "react";
import {Camera, CameraType} from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import {createConference} from '@/services/api/create-conference';
import {uploadConferenceVideo} from "@/services/api/upload-conference-video";
import * as ImageManipulator from "expo-image-manipulator";
import {FlipType, SaveFormat} from "expo-image-manipulator";
import {detectFaces} from "@/services/api/amazon-rekognition";
import {calculateAttention} from "@/services/api/calculate-attention";
import {Buffer} from "buffer";
import {Canvas, matchFont, Path, Skia, SkPath, TextPath, useCanvasRef} from "@shopify/react-native-skia";
import {useSharedValue} from 'react-native-reanimated';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useGlobalSearchParams, useLocalSearchParams} from "expo-router";

export default function CameraScreen() {
    const params = useLocalSearchParams<{ confId: string }>();

    const [type, setType] = useState(CameraType.front);
    const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const [videoUri, setVideoUri] = useState<string | null>(null)
    const [videoId, setVideoId] = useState<string | null>(null)
    const [recording, setRecording] = useState(false);
    const cameraRef = useRef<Camera>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const canvasRef = useCanvasRef()
    const [paths, setPaths] = useState<SkPath[]>([]);
    const [texts, setTexts] = useState<{ text: string, path: SkPath }[]>([])
    const canvasSize = useSharedValue({width: 0, height: 0});
    const fontFamily = Platform.select({ios: "Helvetica", default: "serif"});
    const fontStyle = {
        fontFamily,
        fontSize: 24,
    };
    const skFont = matchFont(fontStyle);

    useEffect(() => {
        requestCameraPermission().catch(console.error);
        requestMediaPermission().catch(console.error);
    }, []);

    useEffect(() => {
        if (recording) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            intervalRef.current = setInterval(async () => {
                const picture = await cameraRef.current?.takePictureAsync({
                    exif: true,
                    base64: true,
                });

                const newWidth = 300;
                const newHeight = newWidth * picture!.height / picture!.width;

                const image = await ImageManipulator.manipulateAsync(
                    picture!.uri,
                    [{resize: {width: newWidth, height: newHeight}}, {flip: FlipType.Horizontal}], //
                    {base64: true, format: SaveFormat.JPEG},
                );

                const source = encodeURIComponent(image.base64!);
                const buffer = Buffer.from(decodeURIComponent(source), 'base64')

                const response = await detectFaces(buffer);

                const paths: SkPath[] = [];
                const texts: { text: string, path: SkPath }[] = [];

                for (const faceDetails of response.FaceDetails!) {
                    const attention = calculateAttention(faceDetails);

                    const box = faceDetails.BoundingBox!;

                    const canvasWidth = canvasSize.value.width;
                    const canvasHeight = canvasSize.value.height;

                    const boxLeft = canvasWidth * box.Left! - 20;
                    const boxTop = canvasHeight * box.Top! - 30;
                    const boxWidth = canvasWidth * box.Width! + 30;
                    const boxHeight = canvasHeight * box.Height! + 50;

                    const path = Skia.Path.Make();
                    path.moveTo(boxLeft!, boxTop!);
                    path.lineTo(boxLeft! + boxWidth!, boxTop!);
                    path.lineTo(boxLeft! + boxWidth!, boxTop! + boxHeight!);
                    path.lineTo(boxLeft!, boxTop! + boxHeight!);
                    path.lineTo(boxLeft!, boxTop!);
                    path.close();

                    paths.push(path);

                    const textPath = Skia.Path.Make();
                    textPath.moveTo(boxLeft!, boxTop!)
                    textPath.lineTo(boxLeft! + boxWidth! + 200, boxTop!);
                    textPath.close();

                    texts.push({
                        text: `Attention: ${attention.toFixed(0)}%`,
                        path: textPath
                    });
                }

                setPaths(paths);
                setTexts(texts);
            }, 500);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setPaths([]);
            setTexts([]);
        }
    }, [recording]);

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const startVideoRecording = async () => {
        setRecording(true)

        // const response = await createConference({ topic: 'media' });
        const video = await cameraRef.current?.recordAsync();

        await uploadConferenceVideo({
            videoUri: video!.uri,
            conferenceId: params.confId
        })
    }

    const stopVideoRecording = async () => {
        setRecording(false)
        cameraRef.current?.stopRecording()
    }

    const clearCanvas = () => {
        setTexts([])
        setPaths([])
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={cameraRef}>
                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonsWrapper}>
                        <TouchableOpacity onPress={clearCanvas}>
                            <FontAwesome name={'trash'} style={{width: 36, fontSize: 36}} color={'white'}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={recording ? stopVideoRecording : startVideoRecording}>
                            <View
                                style={[styles.recordButton, recording ? [{backgroundColor: 'red'}] : [{backgroundColor: 'white'}]]}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleCameraType}>
                            <FontAwesome name={'rotate-right'} style={{width: 36, fontSize: 36}} color={'white'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Camera>
            <Canvas ref={canvasRef} style={styles.canvas} pointerEvents="none" onSize={canvasSize}>
                {
                    paths.map((path, index) =>
                        <Path
                            key={index * 2}
                            path={path}
                            color="lightblue"
                            style="stroke"
                            strokeJoin="round"
                            strokeWidth={5}
                        />)
                }
                {
                    texts.map((attention, index) =>
                        <TextPath key={index * 2 + 1} {...attention} font={skFont} color={'white'}/>
                    )
                }
            </Canvas>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
    },
    camera: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 36,
        alignItems: 'flex-end',
        alignContent: 'center',
        alignSelf: 'center',
    },
    buttonsWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent'
    },
    flipButton: {
        flex: 1,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    recordButton: {
        backgroundColor: '#fff',
        borderRadius: 100,
        width: 70,
        height: 70,
    },
    canvas: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    }
});
