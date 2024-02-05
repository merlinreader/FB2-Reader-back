export const up = async (db, client) => {
    // Используем updateMany без фильтра, чтобы обновить все документы
    await db.collection("users").updateMany({}, [
        {
            $set: {
                tempWordModeAchievements: "$achievements.wordModeAchievements",
                "achievements.wordModeAchievements": "$achievements.simpleModeAchievements"
            }
        },
        {
            $set: {
                "achievements.simpleModeAchievements": "$tempWordModeAchievements"
            }
        },
        {
            $unset: "tempWordModeAchievements"
        }
    ]);
};

export const down = async (db, client) => {};
