/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react'
import { toast } from 'react-custom-alert'
import Loading from './Loading'
import { useStorage } from '../utils/hooks'
import { InputChange, FormSubmit, IUserLogin } from '../utils/types'
import { useLoginMutation } from '../redux/api/auth'
import { vallidEmail } from '../utils/valid'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const initalState: IUserLogin = {
    email: '',
    password: '',
  }

  const [login, setLogin] = useState<IUserLogin>(initalState)
  const { email, password } = login
  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target
    setLogin({ ...login, [name]: value })
  }
  const router = useNavigate()
  const [loading, setLoading] = useState(false)
  const session = useStorage()
  const fakeRs = {
    data: {
      user: {
        id: '64d5bc027f6edb62664b4019',
        name: 'long',
        email: 'long@gmail.com',
        password: '123456',
        role: 'admin',
      },
    },
  }
  const [loginUser] = useLoginMutation()
  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    if (!vallidEmail(email)) {
      toast.error('Email không hợp lệ')
      return
    }

    if (
      email === fakeRs.data.user.email &&
      password === fakeRs.data.user.password
    ) {
      session.setItem('user', JSON.stringify(fakeRs.data.user), 'local')
      toast.success('Đăng nhập thành công')
      router('/')
    }
    // loginUser(login)
    //   .then((result: any) => {
    //     if (result.data) {
    //       setLoading(false);
    //       toast.success("Đăng nhập thành công");
    //       router.push("/");
    //       const dataUser = {
    //         ...result.data.user,
    //         token: result.data.access_token,
    //       };
    //       session.setItem("user", JSON.stringify(dataUser), "local");
    //     } else {
    //       setLoading(false);
    //       toast.error("Đăng nhập thất bại");
    //     }
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     toast.error("Đăng nhập thất bại");
    //   });
  }

  if (loading) return <Loading />
  return (
    <section id="section">
      <div className="box">
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="square" />
        <div className="container">
          <div className="form">
            <h2>LOGIN</h2>
            <form id="form" onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <input
                  type="text"
                  placeholder="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChangeInput}
                />
                <span className="form-message" />
              </div>
              <div className="form-group mb-4">
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChangeInput}
                />
                <span className="form-message" />
              </div>

              <div className="form-group">
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
