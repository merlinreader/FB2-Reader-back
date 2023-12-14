export const up = async (db, client) => {
    await db.collection("users").updateMany({}, [
        {
            $set: {
                "achievements.baby.picture": {
                    $cond: {
                        if: "$achievements.baby.picture",
                        then: { $replaceOne: { input: "$achievements.baby.picture", find: "https://fb2.cloud.leam.pro/api", replacement: "" } },
                        else: ""
                    }
                },
                "achievements.spell.picture": {
                    $cond: {
                        if: "$achievements.spell.picture",
                        then: { $replaceOne: { input: "$achievements.spell.picture", find: "https://fb2.cloud.leam.pro/api", replacement: "" } },
                        else: ""
                    }
                },
                "avatar.picture": {
                    $cond: {
                        if: "$avatar.picture",
                        then: { $replaceOne: { input: "$avatar.picture", find: "https://fb2.cloud.leam.pro/api", replacement: "" } },
                        else: ""
                    }
                }
            }
        },
        {
            $set: {
                "achievements.wordModeAchievements": {
                    $map: {
                        input: "$achievements.wordModeAchievements",
                        as: "achievement",
                        in: {
                            $mergeObjects: [
                                "$$achievement",
                                { picture: { $replaceOne: { input: "$$achievement.picture", find: "https://fb2.cloud.leam.pro/api", replacement: "" } } }
                            ]
                        }
                    }
                },
                "achievements.simpleModeAchievements": {
                    $map: {
                        input: "$achievements.simpleModeAchievements",
                        as: "achievement",
                        in: {
                            $mergeObjects: [
                                "$$achievement",
                                { picture: { $replaceOne: { input: "$$achievement.picture", find: "https://fb2.cloud.leam.pro/api", replacement: "" } } }
                            ]
                        }
                    }
                }
            }
        }
    ]);
};

export const down = async (db, client) => {};
