export const handleDownload = (path: string) => {
  const fileName = path.split('/').pop()
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'blob'
  xhr.onload = () => {
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(xhr.response)
    a.download = fileName!
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
  xhr.open('GET', path)
  xhr.send()
}
