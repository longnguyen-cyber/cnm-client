export function countEmojis(text: string) {
  const emojiRegexp =
    /[\p{Emoji_Presentation}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}\u{E0020}-\u{E007F}\u{FE0F}\u{1F90C}-\u{1F90F}\u{1F93C}-\u{1F93E}\u{1F9CF}-\u{1F9FF}\u{1F237}\u{1F238}\u{1F239}\u{1F23A}\u{1F250}\u{1F251}]/gu
  const matches = text.match(emojiRegexp)
  const counts: { [key: string]: number } = {}

  if (matches) {
    matches.forEach((emoji) => {
      if (!counts[emoji]) {
        counts[emoji] = 1
      } else {
        counts[emoji]++
      }
    })
  }

  return counts
}
