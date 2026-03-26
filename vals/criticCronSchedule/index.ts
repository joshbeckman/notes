const CRITIC_CRON_URL = "https://joshbeckman--27194dee291c11f1a04e42dde27851f2.web.val.run/cron";

export default async function () {
  const resp = await fetch(CRITIC_CRON_URL);
  const result = await resp.json();
  console.log("Critic cron result:", JSON.stringify(result));
}
