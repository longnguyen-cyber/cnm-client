import Link from 'next/link'

const Default = () => {
  //make random square with random position and size min 100*100
  const Square = () => {
    return Array.from({ length: 20 }).map((_, index) => (
      <div
        key={index}
        className="square"
        style={{
          top: `${Math.floor(Math.random() * 100)}%`,
          right: `${Math.floor(Math.random() * 100)}%`,
          width: `calc(${Math.floor(Math.random() * 100)}px + 100px)`,
          height: `calc(${Math.floor(Math.random() * 100)}px + 100px)`,
          position: 'absolute',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '10px',
          animation: 'animate 10s linear infinite',
          animationDelay: `calc(-1s * ${index})`,
        }}
      />
    ))
  }

  return (
    <section id="section" className="w-screen h-screen relative">
      <p>Bạn chưa đăng nhập vui lòng đăng nhập</p>
      <br />
      <Link href="/login">Đăng nhập</Link>
    </section>
  )
}

export default Default
