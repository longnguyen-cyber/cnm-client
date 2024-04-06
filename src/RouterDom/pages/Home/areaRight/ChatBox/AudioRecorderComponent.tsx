import React, { useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import UserApi from "../../../../../api/user";
// import { AudioRecorder } from 'react-audio-voice-recorder';

const AudioRecorderComponent = () => {
  const [audioDetails, setAudioDetails] = useState();

  const handleAudioStop = (data: any) => {
    console.log(data);
    setAudioDetails(data);
  };
  const handleAudioUpload = () => {
    // console.log(audioDetails);
    console.log("---------audioDetails------------>", audioDetails);

  };

  // const handleRest = () => {
  //   const reset = {
  //     url: null,
  //     blob: null,
  //     chunks: null,
  //     duration: {
  //       h: 0,
  //       m: 0,
  //       s: 0,
  //     },
  //   };
  //   setAudioDetails(reset);
  // };
  
  const beforeUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("files", file); // Chú ý là "files" nếu server dùng AnyFilesInterceptor()

    try {
      const response = await UserApi.userUploadImage(formData);

    } catch (error) {
      console.error(error);
    }
  };

  const addAudioElement = (blob: any) => {
    console.log("audioElement", blob);
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
    setAudioDetails(blob);
    // const formData = new FormData();
    beforeUpload(blob);

  };

  return (
    <div>
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={true}
        downloadFileExtension="mp3"
        showVisualizer={true}
      />
    </div>
  );
};

export default AudioRecorderComponent;
