export async function sendScore({ score = 0, name = "noname" }) {
  const rawResponse = await fetch("/score", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, score })
  });

  const scores = await rawResponse.json();
  return scores;
}

export async function getScore() {
  const rawResponse = await fetch("/score", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  const scores = await rawResponse.json();
  return scores;
}
