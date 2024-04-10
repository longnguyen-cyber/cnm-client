import React, { FunctionComponent } from 'react'
import { MdFileDownload } from 'react-icons/md'
import moment from 'moment';
import "moment/locale/vi";
moment.locale('vi');
export const ShowPdf:FunctionComponent<any>=({file})=> {

    const handleDownload = (pdfUrl:any,filename:any) => {
        // Tạo một thẻ a ẩn để tải xuống tệp PDF
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

  return (
    <div>
<div className='flex w-72 p-3 cursor-pointer items-center justify-between'>
    <div className='flex items-center gap-4'>
      <img src='https://chat.zalo.me/assets/icon-pdf.53e522c77f7bb0de2eb682fe4a39acc3.svg'/>
        <div>
          <p>{file.filename}</p>
          <p>{file.size}</p>

        </div>
    </div>
    <p className='mr-2'>
      <button onClick={() => handleDownload(file.path, file.filename)}>
        <MdFileDownload size={30}/>
      </button>
   
    </p>
     
  </div>
    </div>
    
  )
}
