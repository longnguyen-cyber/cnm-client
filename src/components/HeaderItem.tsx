import { Dropdown } from 'flowbite-react'
import { AiOutlineLock } from 'react-icons/ai'
import { useChannel, useDirect } from '../utils/hooks'
import { IUser } from '../utils/types'

const HeaderItem = () => {
  const channel = useChannel()
  const user = useDirect()

  return (
    <div className="h-12 flex items-center p-4 border-b-2 border-zinc-700">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 text-zinc-200 font-semibold">
          <Dropdown
            inline
            label={
              channel ? (
                channel?.isPublic ? (
                  <># {channel?.name}</>
                ) : (
                  <>
                    <AiOutlineLock /> {channel?.name}
                  </>
                )
              ) : (
                <>{user?.name}</>
              )
            }
          >
            {/* future */}
            <Dropdown.Item className="text-black">View profile</Dropdown.Item>
            <Dropdown.Item className="text-black">
              Start a conversation
            </Dropdown.Item>
          </Dropdown>
        </div>
        {channel && (
          <div className="flex items-center text-zinc-200 gap-2 ease-linear duration-150 p-1 rounded cursor-pointer">
            <div className="relative inline-flex items-center">
              {channel?.users &&
                channel.users.map((user: IUser, index: number) => {
                  const countDisplay = 3
                  if (index < countDisplay) {
                    return (
                      <img
                        key={user.id} // Add a unique key to each image element
                        className="rounded bg-white h-8 w-8 object-cover border"
                        style={{
                          // zIndex: -index,
                          position: 'relative', // Add relative positioning for stacking
                          left: `-${index * 5}px`, // Adjust the top position for stacking
                        }}
                        src={user.avatar}
                        alt="logo"
                        width={30}
                        height={30}
                      />
                    )
                  } else {
                    return (
                      <span className="text-[#ccc]" key={user.id}>
                        + {channel?.users!.length - countDisplay}
                      </span>
                    )
                  }
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderItem
