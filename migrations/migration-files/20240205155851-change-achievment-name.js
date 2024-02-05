/* eslint-disable guard-for-in */
export const up = async (db, client) => {
    // Обновление достижений, удаляя кавычки вокруг "Слово"
    db.collection("users").updateMany({}, [
        {
            $set: {
                "achievements.wordModeAchievements": {
                    $map: {
                        input: "$achievements.wordModeAchievements",
                        in: {
                            $mergeObjects: [
                                "$$this",
                                {
                                    description: {
                                        $replaceAll: {
                                            input: "$$this.description",
                                            find: '"Слово"',
                                            replacement: "Слово"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    ]);
};

export const down = async (db, client) => {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};
