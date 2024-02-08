import { IFile } from '../utils/types'
import { FaArchive } from 'react-icons/fa'
import { FaFileExcel, FaFilePdf, FaFileZipper } from 'react-icons/fa6'
import { BsFileWordFill, BsFiletypeMp3, BsFiletypeMp4 } from 'react-icons/bs'
import { AiFillFilePpt } from 'react-icons/ai'
import { BiSolidFileTxt } from 'react-icons/bi'
import { PiFileCsv } from 'react-icons/pi'
import { handleDownload } from '../utils/downloadFile'
import { useEffect, useState } from 'react'
const DisplayFile = ({ file }: { file: IFile }) => {
  const displaysIconFile = [
    {
      id: 'pdf',
      icon: (
        <div className="text-red-400">
          <FaFilePdf className="w-6 h-6 mr-1" />
        </div>
      ),
    },
    {
      id: 'zip',
      icon: <FaFileZipper className="w-6 h-6 mr-1 text-yellow-500" />,
    },
    { id: 'rar', icon: <FaArchive className="w-6 h-6 mr-1 text-green-500" /> },
    {
      id: 'docx',
      icon: <BsFileWordFill className="w-6 h-6 mr-1 text-blue-700" />,
    },
    {
      id: 'pptx',
      icon: <AiFillFilePpt className="w-6 h-6 mr-1 text-red-600" />,
    },
    {
      id: 'xlsx',
      icon: <FaFileExcel className="w-6 h-6 mr-1 text-green-600" />,
    },
    {
      id: 'txt',
      icon: <BiSolidFileTxt className="w-6 h-6 mr-1 text-gray-700" />,
    },
    { id: 'csv', icon: <PiFileCsv className="w-6 h-6 mr-1 text-yellow-500" /> },
    // { id: 'other', icon: <CiFileOn className="w-6 h-6 mr-1 text-gray-500" /> },
    {
      id: 'mp3',
      icon: <BsFiletypeMp3 className="w-6 h-6 mr-1 text-purple-600" />,
    },
    {
      id: 'mp4',
      icon: <BsFiletypeMp4 className="w-6 h-6 mr-1 text-pink-600" />,
    },
  ]
  const fileType = file.filename.split('.')[1]
  const [img, setImg] = useState('')
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setImg('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  if (
    file.filename.includes('png') ||
    file.filename.includes('jpg') ||
    file.filename.includes('jpeg') ||
    file.filename.includes('gif') ||
    file.filename.includes('bmp') ||
    file.filename.includes('tiff')
  ) {
    return (
      <>
        <div
          className="w-1/4 h-1/4"
          onClick={() => {
            setImg(file.path)
          }}
        >
          <img src={file.path} alt={file.filename} />
        </div>
        {img && (
          <div
            className="fixed inset-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={() => setImg('')}
          >
            <button
              className="
            absolute top-0 right-0 m-2 p-2 h-10 w-10 rounded-full bg-gray-800 bg-opacity-50 text-white flex items-center justify-center
            "
            >
              X
            </button>
            <img
              src={img}
              alt=""
              className="max-w-4xl max-h-full"
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          </div>
        )}
      </>
    )
  } else {
    return (
      <div
        className="border border-gray-50 rounded shadow p-2 flex items-start cursor-pointer "
        onClick={() => handleDownload(file.path)}
      >
        {displaysIconFile.find((e) => e.id === fileType)?.icon}
        <div className="flex flex-col">
          {file.filename}
          {file.size && (
            <span className="text-xs text-gray-400">
              {/* ({(file.size / 1024).toFixed(2)} KB) */}
              {file.size < 1
                ? `${(file.size * 1024).toFixed(2)} KB`
                : `${file.size} MB`}
            </span>
          )}
        </div>
      </div>
    )
  }
}

export default DisplayFile
