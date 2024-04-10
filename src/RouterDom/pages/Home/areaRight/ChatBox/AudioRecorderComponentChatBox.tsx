import React, { FunctionComponent, useContext, useState } from 'react'
import { AudioRecorder } from 'react-audio-voice-recorder'
import UserApi from '../../../../../api/user'
import { UserContext } from '../../../../../Context/UserContext'
// import { AudioRecorder } from 'react-audio-voice-recorder';

const AudioRecorderComponentChatBox: FunctionComponent<any> = ({ selectedChat }) => {
  const [audioDetails, setAudioDetails] = useState()
  const contextUser = useContext(UserContext)
  const { state } = contextUser
  const [user, setUser] = state.user
  const { socket } = state
  const handleAudioStop = (data: any) => {
    setAudioDetails(data)
  }
  const handleAudioUpload = () => {
    // console.log(audioDetails);
    console.log('---------audioDetails------------>', audioDetails)
  }

 
  const beforeUpload = async (file: any) => {
    const formData = new FormData()
    formData.append('files', file) // Chú ý là "files" nếu server dùng AnyFilesInterceptor()

    try {
      const response = await UserApi.userUploadImage(formData)
      const Thread = {
        channelId: selectedChat.id,
        userId: user.id,
        senderId:user.id,
        fileCreateDto: response.data,
      }
      if (socket) {
        socket.emit('sendThread', Thread)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const addAudioElement = (blob: any) => {
    console.log('audioElement', blob)
    const url = URL.createObjectURL(blob)
    const audio = document.createElement('audio')
    audio.src = url
    audio.controls = true
    document.body.appendChild(audio)
    setAudioDetails(blob)
    // const formData = new FormData();
    beforeUpload(blob)
  }

  return (
    <div className="mt-2">
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        // downloadFileExtension="mp3"
        showVisualizer={true}
      />
    </div>
  )
}

export default AudioRecorderComponentChatBox
