import { Button, Modal, Image } from "antd";
import React, { useEffect, useState } from "react";
import { InputOTP } from 'antd-input-otp'; 
import axios from "axios";
interface IFormModal2Fa {
  handleCancel: () => void;
}

const FormModal2Fa = ({ handleCancel }: IFormModal2Fa) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [value, setValue] = useState<string[]>([]);

  const accessToken = JSON.parse(
    localStorage.getItem("accessTokenToGen2fa") as string
  ).data.token;
  const urlCall2Fa = process.env.REACT_APP_API_URL + "users/2fa/generate";

  const [data2FA, setData2FA] = useState<any>(null);
  const handle2fa = async (accessToken: string) => {
    const response = await axios.post(
      urlCall2Fa,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
          Accept: "application/json",
        },
      }
    );
   
    return response.data;
  };
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data2FA = await handle2fa(accessToken);
        // console.log('data2FA------>', data);
        setData2FA(data2FA.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const showModal = () => {
    setOpen(true);
  };
 
  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    const handleFinish = (otp:string) => {
      const payload = otp || value; // Since useState work asynchronously, we shall add the field value from the autoSubmit.
      // Your logic with state
      setConfirmLoading(true);
    };
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  return (
    <Modal
      width={400}
      title="Mã 2FA"
      open={true}
      onOk={handleOk}
      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          {/* <OkBtn/> */}
          <Button className="bg-blue-500">Gửi</Button>
          <Button onClick={handleCancel} className="">
            Hủy
          </Button>
        </>
      )}
    >
      <div style={{display: 'flex', justifyContent: 'center',flexDirection: 'column'}}>

      <Image className="flex items-center" src={data2FA ? data2FA : ""}   width={200}/>
      <InputOTP onChange={setValue} value={value} autoSubmit={handleOk} />
      </div>
    </Modal>
  );
};

export default FormModal2Fa;
