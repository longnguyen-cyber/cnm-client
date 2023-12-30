import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { channelsState, directState } from './state'
import { StorageType, UseStorageReturnValue } from './types'

export const useStorage = (): UseStorageReturnValue => {
  const storageType = (type?: StorageType): 'localStorage' | 'sessionStorage' =>
    `${type ?? 'session'}Storage`

  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')()

  const getItem = (key: string, type?: StorageType): string => {
    return isBrowser ? window[storageType(type)][key] : ''
  }

  const setItem = (key: string, value: string, type?: StorageType): boolean => {
    if (isBrowser) {
      window[storageType(type)].setItem(key, value)
      return true
    }

    return false
  }

  const removeItem = (key: string, type?: StorageType): void => {
    window[storageType(type)].removeItem(key)
  }

  return {
    getItem,
    setItem,
    removeItem,
  }
}

export const useFormattedDate = (inputDateString: string) => {
  const inputDate = new Date(inputDateString)

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const formattedDate = `${inputDate.getUTCDate()} ${
    months[inputDate.getUTCMonth()]
  } ${inputDate.getUTCFullYear()} ${inputDate
    .getUTCHours()
    .toString()
    .padStart(2, '0')}:${inputDate.getUTCMinutes().toString().padStart(2, '0')}`

  return formattedDate
}

export const useformatDate = (inputDateString?: string): string => {
  if (!inputDateString) return ''

  const dateObj = new Date(inputDateString)
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  let hours = dateObj.getHours()
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  const seconds = String(dateObj.getSeconds()).padStart(2, '0')
  let ampm = 'AM'

  if (hours >= 12) {
    ampm = 'PM'
    if (hours > 12) {
      hours -= 12
    }
  }

  hours = String(hours).padStart(2, '0') as unknown as number

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`
  return formattedDate
}

export const useformatTime = (inputTimeString?: string): string => {
  if (!inputTimeString) return ''

  const dateObj = new Date(inputTimeString)
  let hours = dateObj.getHours()
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'

  if (hours >= 12) {
    hours -= 12
  }
  if (hours === 0) {
    hours = 12
  }

  hours = String(hours).padStart(2, '0') as unknown as number

  const formattedTime = `${hours}:${minutes} ${ampm}`
  return formattedTime
}

export function isValidDateTimeFormat(input: string): boolean {
  const dateTimePattern: RegExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

  if (!dateTimePattern.test(input)) {
    return false
  }

  const [datePart, timePart] = input.split(' ')

  const [year, month, day] = datePart.split('-').map(Number)

  const [hours, minutes, seconds] = timePart.split(':').map(Number)

  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    isNaN(hours) ||
    isNaN(minutes) ||
    isNaN(seconds)
  ) {
    return false
  }

  if (
    year < 1000 ||
    year > 9999 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return false
  }

  return true
}
export const useDirect = (id?: string) => {
  const direct = useRecoilValue(directState)
  const location = window.location
  const user = useMemo(() => {
    return direct.find(
      (user) =>
        user.id === (id ? id : new URLSearchParams(location.search).get('id'))
    )
  }, [direct, id, location.search])
  return user
}

export const useChannel = (id?: string) => {
  const channels = useRecoilValue(channelsState)
  const location = window.location
  const channel = useMemo(() => {
    return channels.find(
      (channel) =>
        channel.id ===
        (id ? id : new URLSearchParams(location.search).get('id'))
    )
  }, [channels, id, location.search])
  return channel
}
