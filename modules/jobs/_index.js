import JobsWithAchievements from "./receive_achievements.js";

export default [
    { time: "0 0 * * *", job: JobsWithAchievements.setDailyAchievements },
    { time: "0 0 * * 1", job: JobsWithAchievements.setWeeklyAchievements },
    { time: "0 0 1 * *", job: JobsWithAchievements.setMonthlyAchievements },
    { time: "0 0 1 */6 *", job: JobsWithAchievements.setSemiAnnualAchievements },
    { time: "0 0 1 1 *", job: JobsWithAchievements.setYearAchievements }
];
