import React, { FunctionComponent } from 'react'
import { MdFileDownload } from 'react-icons/md'
import moment from 'moment';
import "moment/locale/vi";
moment.locale('vi');
export const  ShowWord:FunctionComponent<any>=(file:any)=> {
   
    const handleDownload = (pdfUrl:any,filename:any) => {
        // Tạo một thẻ a ẩn để tải xuống tệp PDF
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // createdAt
  return (
    <div>
<div className='flex w-72 p-3 cursor-pointer items-center justify-between'>
              <div className='flex items-center gap-1'>
             
                <img src='https://chat.zalo.me/assets/icon-word.d7db8ecee5824ba530a5b74c5dd69110.svg'/>
             
              
                
                  <div>
                    <p>{file.file.filename}</p>
                    <p>{file.file.size}</p>

                  </div>
              </div>
              <p className='mr-2'>
                <button onClick={() => handleDownload(file.file.path, file.file.filename)}>
                  <MdFileDownload size={30}/>
                </button>
             
              </p>
               
            </div>
          

    </div>
    
  )
}
