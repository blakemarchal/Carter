/** A line in sentences: "Great job! 3 plus 4." -> ["Great job!", "3 plus 4."] */
export function sentences(text: string): string[] {
  // (a new sentence starts with a capital, a number, a letter sound or a quote: "Even… me?" he whispered. is one)
  return text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?…]["”'’]?)\s+(?=["“']?[\p{Lu}\d⟦])/u).filter(Boolean)
}
