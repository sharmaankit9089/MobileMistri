/**
 * Parses spintax like {Best|Top|Expert} Repair in {Delhi|your city}.
 * It uses a deterministic random generator seeded by `seedString` 
 * so that the output is consistent for the same seed (e.g. citySlug-brandSlug).
 */
export function parseSpintax(text, seedString = "") {
  if (!text) return "";
  if (typeof text !== "string") return text;
  
  // Create a simple deterministic random generator based on the seed
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed = (seed * 31 + seedString.charCodeAt(i)) % 2147483647;
  }
  
  // Ensure seed is never 0
  if (seed === 0) seed = 123456789;
  
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const spintaxRegex = /\{([^{}]*)\}/;
  let result = text;
  
  // Parse innermost { } recursively
  while (spintaxRegex.test(result)) {
    result = result.replace(spintaxRegex, (match, contents) => {
      const choices = contents.split('|');
      const idx = Math.floor(random() * choices.length);
      return choices[idx];
    });
  }
  
  return result;
}
