import generateCode from "./generateCode.js";

const generateUniqueCode = async (
  value,
  existsFn
) => {
  const baseCode = generateCode(value);

  let code = baseCode;
  let counter = 1;

  while (await existsFn(code)) {
    code = `${baseCode}_${counter}`;
    counter++;
  }

  return code;
};

export default generateUniqueCode;