export function extractData(text) {
  return {
    name: text.match(/Name[:\s]+(.+)/i)?.[1] || "",
    email: text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "",
    phone: text.match(/\+?\d[\d\s-]{8,}/)?.[0] || "",
    skills:
      text
        .match(/Skills[:\s]+([\s\S]*?)(Experience|Education|$)/i)?.[1]
        ?.trim() || "",
    experience:
      text
        .match(/Experience[:\s]+([\s\S]*?)(Education|Skills|$)/i)?.[1]
        ?.trim() || "",
    education:
      text
        .match(/Education[:\s]+([\s\S]*?)(Skills|Experience|$)/i)?.[1]
        ?.trim() || "",
  };
}
