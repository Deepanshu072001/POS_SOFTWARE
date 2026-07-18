const serializeRole = (role) => {
  if (!role) return null;

  return {
    id: role._id,
    name: role.name,
    description: role.description ?? "",  
};
};

export default serializeRole;