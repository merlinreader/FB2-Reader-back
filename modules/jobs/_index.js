import JobsWithAchievements from "./receive_achievements.js";

export default [
    { time: "00 00 00 * * *", job: JobsWithAchievements.setDailyAchievements },
    { time: "00 00 00 * * 0", job: JobsWithAchievements.setWeeklyAchievements },
    { time: "00 00 00 * * *", job: JobsWithAchievements.setMonthlyAchievements },
    { time: "00 00 00 * */6 *", job: JobsWithAchievements.setSemiAnnualAchievements },
    { time: "00 00 00 * 12 *", job: JobsWithAchievements.setYearAchievements }
];
