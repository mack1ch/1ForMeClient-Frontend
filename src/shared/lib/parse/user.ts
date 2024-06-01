export const parseNameToNameAndSurname = (input: string) => {
  const words = input.split(" ");
  if (words.length === 2) {
    return words;
  } else if (words.length === 1) {
    return [input];
  } else {
    return ["Input should contain one or two words."];
  }
};
