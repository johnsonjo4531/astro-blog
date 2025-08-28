import { useEffect, useRef, useState } from "react";
import type { JsxElement } from "typescript";

type GameSettings = {
  variant: "winner-takes-last" | "loser-takes-last";
  min: number;
  max: number;
  n: number;
};

type TurnChoice = { take: number; user_type: "user" | "computer" };

/** Computes the constant and guaranteed loss during optimal play between two rounds (i.e. between both players)
 *
 * This number is always guaranteed, because when one person decides to "mirror" the other player's
 * choice (e.g. player 1 takes `min` then player 2 takes `max`, or player 1 takes `min + 1` then player 2 takes `max - 1`)
 * they can always force such a number reduction between the two players. This allows for an optimal play strategy
 * by allowing one person to essentially stick another player constantly in a losing position (a poison number/position).
 */
function compute2RoundOptimalLoss({ min, max }: { min: number; max: number }) {
  return max + min;
}

function computePoisonNumber({ variant, min, max, n }: GameSettings) {
  const optimalLoss = compute2RoundOptimalLoss({ min, max });
  return (
    optimalLoss * Math.floor((n - min) / optimalLoss) +
    (variant === "winner-takes-last" ? 0 : min)
  );
}

function compute1RoundOptimalLoss({ variant, min, max, n }: GameSettings) {
  console.log("CHOOSING OPTIMALLY!");
  const poisonNumber = computePoisonNumber({ variant, min, max, n });
  const optimalTake = n - poisonNumber;

  console.log({ optimalTake });
  // -1 represents that there is no optimal move...
  return optimalTake >= min && optimalTake <= max ? optimalTake : -1;
}

// From MDN!
// The maximum is inclusive and the minimum is inclusive
export function getRandomIntInclusive(min: number, max: number) {
  const [minCeiled, maxFloored] = [Math.ceil(min), Math.floor(max)];
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function useComputer({
  optimal = true,
  choices,
  setChoices,
  variant,
  min,
  max,
  n,
}: {
  choices: TurnChoice[];
  setChoices: React.Dispatch<React.SetStateAction<TurnChoice[]>>;
  optimal?: boolean;
} & GameSettings) {
  useEffect(() => {
    if (n > 0 && choices.at(-1)?.user_type === "user") {
      // Time to take a turn for the computer
      const randomChoice = (): TurnChoice => ({
        take: getRandomIntInclusive(min, Math.min(max, n)),
        user_type: "computer",
      });
      const optimalChoice = (): TurnChoice => {
        const optimalLoss = compute1RoundOptimalLoss({ max, min, variant, n });
        return optimalLoss === -1
          ? // We do a random choice here so we don't give away to the user that they have found something optimal.
            // Sometimes it is easier to win against a opponent and better to take less rather than more when you
            // aren't in a position to win yet, thus giving you more chances to win.
            randomChoice()
          : { take: optimalLoss, user_type: "computer" };
      };
      // It will choose the optimal choice once it is obvious.
      if (!optimal && n > max + min) {
        setChoices((choices) => [...choices, randomChoice()]);
      } else {
        setChoices((choices) => [...choices, optimalChoice()]);
      }
    }
  }, [choices, optimal, max, min, variant, n]);
}

const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));

function useSlowDisplayChoices() {
  const [displayChoices, setDisplayChoices] = useState<TurnChoice[]>([]);
  const [choices, setChoices] = useState<TurnChoice[]>([]);
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    if (status === "idle" && choices.length !== displayChoices.length) {
      setStatus("loading");
      if (choices.at(-1)?.user_type === "user") {
        timeout(0).then(() => {
          setStatus("idle");
          setDisplayChoices(choices);
        });
      } else {
        // Make the computer take longer...
        timeout(500).then(() => {
          setStatus("idle");
          setDisplayChoices(choices);
        });
      }
    }
  }, [choices, displayChoices, status]);

  return [
    choices,
    displayChoices,
    status,
    setChoices,
    // You shouldn't use this most the time except for resetting the game.
    setDisplayChoices,
  ] as const;
}

export function BasicNimGame({ variant, min, max, n: initN }: GameSettings) {
  const [n, setN] = useState(initN);
  const [choices, displayChoices, status, setChoices, setDisplayChoices] =
    useSlowDisplayChoices();
  const inputRef = useRef<HTMLInputElement>(null);
  const [takeStones, setTakeStones] = useState(0);
  let finalN = choices.reduce((sum, choice) => sum - choice.take, n);
  console.log({
    choices,
    setChoices,
    optimal: true,
    variant,
    min,
    max,
    n: finalN,
  });
  useComputer({
    choices,
    setChoices,
    optimal: true,
    variant,
    min,
    max,
    n: finalN,
  });

  console.log({ choices, displayChoices });
  return (
    <div>
      <pre className="astro-code nord">
        Goal:{" "}
        {variant === "winner-takes-last"
          ? "Take the final o"
          : "Make the other player take the last o"}
        <br />
        Rules: You can take anywhere from {min}-{max} o's
        <pre key={n}>
          {new Array(n)
            .fill("o")
            .reduce((acc, o, i) =>
              i % compute2RoundOptimalLoss({ min, max }) != 0
                ? acc + o
                : acc + " " + o,
            )}{" "}
          (START)
        </pre>
        {
          displayChoices.reduce<{ el: React.ReactElement[]; n: number }>(
            ({ el, n }, choice) => ({
              el: [
                ...el,
                n - choice.take <= 0 ? (
                  <div key={0}>
                    <div>
                      (
                      {choice.user_type === "computer" ? "The computer" : "You"}{" "}
                      took the last item)
                    </div>
                    <div>
                      {variant === "loser-takes-last"
                        ? choice.user_type === "computer"
                          ? "YOU WIN! (because the computer took the last item)"
                          : "Computer Wins! (because you took the last item)"
                        : choice.user_type === "computer"
                          ? "Computer Wins! (because the computer took the last item)"
                          : "YOU WIN! (because you took the last item)"}
                    </div>
                  </div>
                ) : (
                  <pre key={n - choice.take}>
                    {new Array(n - choice.take)
                      .fill("o")
                      .reduce((acc, o, i) =>
                        i % compute2RoundOptimalLoss({ min, max }) != 0
                          ? acc + o
                          : acc + " " + o,
                      )}{" "}
                    {choice.user_type === "user"
                      ? "(USER WENT TAKING"
                      : "(COMPUTER WENT TAKING"}{" "}
                    {choice.take}
                    {")"}
                  </pre>
                ),
              ],
              n: n - choice.take,
            }),
            { el: [] as React.ReactElement[], n },
          ).el
        }
        {finalN > 0 &&
          (displayChoices.at(-1)?.user_type === "computer" || status === "idle"
            ? "(WAITING FOR USER TURN...)"
            : "(WAITING FOR COMPUTER TURN...)")}
      </pre>
      <form
        action={(formData) => {
          const take = parseInt(formData.get("pick-number"), 10);
          if (take >= min && take <= max) {
            setChoices((choices) => [
              ...choices,
              {
                take,
                user_type: "user",
              },
            ]);
            setTakeStones(takeStones);
          }
          const input = inputRef.current;
          if (input) {
            input.value = "" + takeStones;
            input.focus();
          }
        }}
      >
        <input
          ref={inputRef}
          placeholder="Input a number"
          name="pick-number"
          type="number"
          value={takeStones || ""}
          min={min}
          max={Math.min(max, finalN)}
          onChange={(e) => {
            const num = parseInt(e.currentTarget.value, 10);
            if (!isNaN(num)) {
              setTakeStones(num);
            }
            if (e.currentTarget.value === "") {
              setTakeStones(0);
            }
          }}
        />
        <button>Take {takeStones} Stones</button>
        <button
          type="button"
          onClick={() => {
            setChoices([]);
            setDisplayChoices([]);
            setN(getRandomIntInclusive(15, 24));
          }}
        >
          Restart
        </button>
      </form>
    </div>
  );
}
