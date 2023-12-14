export const up = async (db, client) => {
    await db.collection("users").updateMany({}, { $set: { avatar: { name: "default_avatar", picture: "/achievement/default_avatar.png" } } });
};

export const down = async (db, client) => {};
