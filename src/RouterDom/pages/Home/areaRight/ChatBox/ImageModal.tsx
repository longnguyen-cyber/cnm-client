import React, { FunctionComponent } from 'react'

export const   ImageModal:FunctionComponent<any>=({isOpen, onRequestClose, src })=> {
    if (!isOpen) return null;
      
    const handleOverlayClick = (event:any) => {
      event.stopPropagation(); // Ngăn chặn sự kiện lan truyền
      onRequestClose(); // Gọi hàm đóng modal
    };
  
    const handleContentClick = (event:any) => {
      event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền ra ngoài
    };
  
    return (
      <div onClick={handleOverlayClick} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div onClick={handleContentClick} style={{ position: 'relative', padding: '20px', background: '#FFF', borderRadius: '8px' }}>
          <button onClick={onRequestClose} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '16px', background: 'none', border: 'none' }}>Close</button>
          <img src={src} style={{ width: '700px', height: '60vh', display: 'block' }} alt="" />
        </div>
      </div>
    );
  }
