import { FaMagnifyingGlass, FaSliders } from 'react-icons/fa6'

const Header = () => {
  return (
    <div className="flex items-center justify-center bg-fuchsia-900 p-2">
      <div className="relative ">
        <input
          type="text"
          id=""
          className="text-white text-sm rounded-lg focus:border-none block w-full p-2.5 bg-[#22252A] outline-none  border-none border-0 outline-0"
          placeholder="Search here..."
          maxLength={80}
        />

        <span className="absolute right-4 text-[#b9b9b9] flex space-x-2 top-1/2 -translate-y-1/2">
          <FaSliders />
          <FaMagnifyingGlass />
        </span>
      </div>
      {/* <div className="flex items-center justify-end p-1 gap-1 flex-1">
        {statusUser === 'success' ? (
          <>
            <FaCircleInfo className="m-2 text-white" />
            {(user?.name as string) && (
              <Image
                className="rounded-full w-8 h-8"
                src={user?.avatar as string}
                alt="logo"
                width={25}
                height={25}
              />
            )}
            <span className="text-white font-sans">
              {user?.email as string}
            </span>
          </>
        ) : (
          <> </>
        )}
      </div> */}
    </div>
  )
}

export default Header
