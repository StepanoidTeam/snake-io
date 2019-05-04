export async function sendScore(score = 0) {
  const rawResponse = await fetch("/setScore", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: "bob", score })
  });

  const scores = await rawResponse.json();
  return scores;
}

export async function getScore() {
  const rawResponse = await fetch("/getScore", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  const scores = await rawResponse.json();
  return scores;
}
