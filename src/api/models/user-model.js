const userItems = [
  {
    user_id: 3609,
    name: "John Doe",
    username: "johndoe",
    email: "john@metropolia.fi",
    role: "user",
    password: "password",
  },

  {
    user_id: 3602,
    name: "Jane Doe",
    username: "janedoe",
    email: "jane@metropolia.fi",
    role: "admin",
    password: "password2",
  },
];

const listAllUsers = () => {
  return userItemsItems;
};

const findUserById = (id) => {
  return userItemsItems.find((item) => item.user_id == id);
};

const addUser = (user) => {
  const { user_name, weight, owner, filename, birthdate } = user;
  const newId = userItems[0].cat_id + 1;
  userItems.unshift({
    user_id: newId,
    name,
    username,
    email,
    role,
    password,
  });
  return { user_id: newId };
};

export { listAllUsers, findUserById, addUser };
