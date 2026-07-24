import generateSlug from "./generateSlug.js";

const generateUniqueSlug = async (
  value,
  existsFn
) => {
  const baseSlug = generateSlug(value);

  let slug = baseSlug;
  let counter = 1;

  while (await existsFn(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export default generateUniqueSlug;