const { updateScore } = require("./score");

function player(index = 1, score = 1) {
  return { name: `player ${index}`, score };
}

describe(updateScore.name, () => {
  describe("player add to", () => {
    test("top", () => {
      const score = [player(4, 4), player(3, 3), player(2, 2), player(1, 1)];

      const result = updateScore(score, player(5, 5));

      expect(result).toEqual([
        player(5, 5),
        player(4, 4),
        player(3, 3),
        player(2, 2),
        player(1, 1)
      ]);
    });

    test("bottom", () => {
      const score = [player(5, 5), player(4, 4), player(3, 3), player(2, 2)];

      const result = updateScore(score, player(1, 1));

      expect(result).toEqual([
        player(5, 5),
        player(4, 4),
        player(3, 3),
        player(2, 2),
        player(1, 1)
      ]);
    });

    test("middle", () => {
      const score = [player(4, 4), player(3, 3), player(1, 1)];

      const result = updateScore(score, player(2, 2));

      expect(result).toEqual([
        player(4, 4),
        player(3, 3),
        player(2, 2),
        player(1, 1)
      ]);
    });
  });

  describe("player update on", () => {
    test("top-top", () => {
      const score = [
        player(5, 5),
        player(4, 4),
        player(3, 3),
        player(2, 2),
        player(1, 1)
      ];

      const result = updateScore(score, player(5, 10));

      expect(result).toEqual([
        player(5, 10),
        player(4, 4),
        player(3, 3),
        player(2, 2),
        player(1, 1)
      ]);
    });

    test("bottom-bottom", () => {
      const score = [
        player(5, 15),
        player(4, 14),
        player(3, 13),
        player(2, 12),
        player(1, 1)
      ];

      const result = updateScore(score, player(1, 10));

      expect(result).toEqual([
        player(5, 15),
        player(4, 14),
        player(3, 13),
        player(2, 12),
        player(1, 10)
      ]);
    });

    test("bottom-top", () => {
      const score = [
        player(5, 15),
        player(4, 14),
        player(3, 13),
        player(2, 12),
        player(1, 1)
      ];

      const result = updateScore(score, player(1, 20));

      expect(result).toEqual([
        player(1, 20),
        player(5, 15),
        player(4, 14),
        player(3, 13),
        player(2, 12)
      ]);
    });

    // ON FULL STACK

    test("full stack update bottom-to-top", () => {
      const score = [
        player(10, 10),
        player(9, 9),
        player(8, 8),
        player(7, 7),
        player(6, 6),
        player(5, 5),
        player(4, 4),
        player(3, 3),
        player(2, 2),
        player(1, 1)
      ];

      const result = updateScore(score, player(1, 20));

      expect(result).toEqual([
        player(1, 20),
        player(10, 10),
        player(9, 9),
        player(8, 8),
        player(7, 7),
        player(6, 6),
        player(5, 5),
        player(4, 4),
        player(3, 3),
        player(2, 2)
      ]);
    });

    test("full stack new player", () => {
      const score = [
        player(10, 10),
        player(9, 9),
        player(8, 8),
        player(7, 7),
        player(6, 6),
        player(5, 5),
        player(4, 4),
        player(3, 3),
        player(2, 2),
        player(1, 1)
      ];

      const result = updateScore(score, player(20, 20));

      expect(result).toEqual([
        player(20, 20),
        player(10, 10),
        player(9, 9),
        player(8, 8),
        player(7, 7),
        player(6, 6),
        player(5, 5),
        player(4, 4),
        player(3, 3),
        player(2, 2)
      ]);
    });

    test("cumulative updates", () => {
      const score = [];

      let result;
      result = updateScore(score, player(1, 1));
      result = updateScore(score, player(10, 10));
      result = updateScore(score, player(2, 2));
      result = updateScore(score, player(9, 9));
      result = updateScore(score, player(3, 3));

      expect(result).toEqual([
        player(10, 10),
        player(9, 9),
        player(3, 3),
        player(2, 2),
        player(1, 1)
      ]);

      result = updateScore(score, player(8, 8));
      result = updateScore(score, player(4, 4));
      result = updateScore(score, player(7, 7));
      result = updateScore(score, player(5, 5));
      result = updateScore(score, player(6, 6));

      expect(result).toEqual([
        player(10, 10),
        player(9, 9),
        player(8, 8),
        player(7, 7),
        player(6, 6),
        player(5, 5),
        player(4, 4),
        player(3, 3),
        player(2, 2),
        player(1, 1)
      ]);
    });
  });
});
