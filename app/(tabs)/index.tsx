import {StyleSheet, TouchableOpacity} from 'react-native';

import {View} from '@/components/Themed';
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
import {Canvas, Path, Text, Skia, SkiaView, SkPath, useCanvasRef} from "@shopify/react-native-skia";
import { useSharedValue } from 'react-native-reanimated';
import type {TextProps} from "@shopify/react-native-skia/src/dom/types";

export default function TabOneScreen() {
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
    const [texts, setTexts] = useState<TextProps[]>([])
    const canvasSize = useSharedValue({ width: 0, height: 0 });

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
                const picture = await cameraRef.current?.takePictureAsync();

                const newWidth = 300;
                const newHeight = newWidth * picture!.height / picture!.width;

                const image = await ImageManipulator.manipulateAsync(
                    picture!.uri,
                    [{resize: {width: newWidth, height: newHeight}}, { flip: FlipType.Horizontal }],
                    {base64: true, format: SaveFormat.JPEG},
                );

                const source = encodeURIComponent(image.base64!);
                const buffer = Buffer.from(decodeURIComponent(source), 'base64')

                const response = await detectFaces(buffer);

                const paths: SkPath[] = [];
                const texts: TextProps[] = [];

                for (const faceDetails of response.FaceDetails!) {
                    const attention = calculateAttention(faceDetails);

                    const box = faceDetails.BoundingBox!;

                    const canvasWidth = canvasSize.value.width;
                    const canvasHeight = canvasSize.value.height;

                    const path = Skia.Path.Make();
                    path.moveTo(box.Left! * canvasWidth, box.Top! * canvasHeight);
                    path.lineTo(box.Left! * canvasWidth + box.Width! * canvasWidth, box.Top! * canvasHeight);
                    path.lineTo(box.Left! * canvasWidth + box.Width! * canvasWidth, box.Top! * canvasHeight + box.Height! * canvasHeight);
                    path.lineTo(box.Left! * canvasWidth, box.Top! * canvasHeight + box.Height! * canvasHeight);
                    path.lineTo(box.Left! * canvasWidth, box.Top! * canvasHeight);
                    path.close();

                    paths.push(path);
                    texts.push({
                        x: box.Left! * canvasWidth,
                        y: box.Top! * canvasHeight - 15,
                        text: `Attention: ${attention.toFixed(0)}%`
                    });
                }

                setPaths(paths);
                setTexts(texts);
            }, 1000);
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
        const response = await createConference({
            topic: 'media'
        });

        const video = await cameraRef.current?.recordAsync();

        await uploadConferenceVideo({
            videoUri: video!.uri,
            conferenceId: response.data.id
        })
    }

    const stopVideoRecording = async () => {
        setRecording(false)
        cameraRef.current?.stopRecording()
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={cameraRef}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={recording ? stopVideoRecording : startVideoRecording}>
                        <View
                            style={[styles.recordButton, recording ? [{backgroundColor: 'red'}] : [{backgroundColor: 'white'}]]}/>
                    </TouchableOpacity>
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
                        <Text key={index * 2 + 1} {...attention} color={'white'}/>
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
        flexDirection: 'row-reverse',
        backgroundColor: 'transparent',
        margin: 36,
        alignItems: 'flex-end',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
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
        backgroundColor: '#ff000033'
    }
});
