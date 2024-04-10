import React, { FunctionComponent, useContext, useState } from 'react'
import { AudioRecorder } from 'react-audio-voice-recorder'
import UserApi from '../../../../../api/user'
import { UserContext } from '../../../../../Context/UserContext'
// import { AudioRecorder } from 'react-audio-voice-recorder';

const AudioRecorderComponent: FunctionComponent<any> = ({ selectedChat }) => {
  const [audioDetails, setAudioDetails] = useState()
  const contextUser = useContext(UserContext)
  const { state } = contextUser
  const [user, setUser] = state.user
  const { socket } = state
  const handleAudioStop = (data: any) => {
    console.log(data)
    setAudioDetails(data)
  }
  const handleAudioUpload = () => {
    // console.log(audioDetails);
    console.log('---------audioDetails------------>', audioDetails)
  }

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
    const formData = new FormData()
    formData.append('files', file) // Chú ý là "files" nếu server dùng AnyFilesInterceptor()

    try {
      const response = await UserApi.userUploadImage(formData)
      console.log(response)
      const Thread = {
        chatId: selectedChat.id,
        receiveId: selectedChat.user.id,
        fileCreateDto: response.data,
      }
      console.log(Thread)
      if (socket) {
        socket.emit('sendThread', Thread)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const addAudioElement = (blob: any) => {
    const url = URL.createObjectURL(blob)
    const audio = document.createElement('audio')
    audio.src = url
    audio.controls = true
    document.body.appendChild(audio)
    setAudioDetails(blob)
    // const formData = new FormData();
    const mp3Blob = new File([`${blob}.mp3`], 'filename.mp3', {
      type: 'audio/mpeg',
    })
    beforeUpload(mp3Blob)
  }

  return (
    <div className="mt-2">
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
  )
}

export default AudioRecorderComponent
