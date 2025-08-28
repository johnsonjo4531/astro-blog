import type { ReactNode } from "react";

// Precise method, which guarantees v = v1 when t = 1.
// https://en.wikipedia.org/wiki/Linear_interpolation
const lerp = (v0: number, v1: number, t: number) => {
  return (1 - t) * v0 + t * v1;
};

function zipJoin(arr1, item) {
  return arr1.reduce((acc, element) => acc.concat([element, item]), []);
}

const orderedNumericsSpeech = (number: number) =>
  ["th", "st", "nd", "rd"][number] || "th";

export function TwoDSandwiches(props) {
  const breads = ["White 🍞", "Wheat 🍞"];
  const cheeses = ["Provolone 🧀", "Cheddar 🧀", "American 🧀"];
  return (
    <TwoDGrid
      xDim={breads}
      yDim={cheeses}
      cb={(bread, cheese, combinationNumber) => `${bread}
			& ${cheese} = ${combinationNumber}${orderedNumericsSpeech(
        combinationNumber,
      )} 🥪`}
    />
  );
}

interface TwoDGridProps {
  xDim: string[];
  yDim: string[];
  cb: (
    firstDimensionElement: string,
    secondDimensionElement: string,
    combinationNum: number,
  ) => string;
}

export function TwoDGrid({ xDim, yDim, cb }: TwoDGridProps) {
  const columns = xDim.length;
  const rows = yDim.length;
  let elements = [];
  let k = 0;
  for (const yItem of yDim) {
    let rowElements = [];
    for (const xItem of xDim) {
      rowElements = rowElements.concat([
        <div
          style={{
            background: "var(--content-gradient)",
            color: "var(--content-text)",
            borderRadius: "5px",
            boxShadow: "0px 2px 3px",
            padding: "0.7em",
            gridArea: `unit-square-${k}`,
            overflowY: "auto",
          }}
        >
          {cb(xItem, yItem, ++k)}
        </div>,
        <div
          style={{
            width: "2px",
            backgroundColor: "var(--logo-text)",
            gridArea: `v-line-${k}`,
          }}
        ></div>,
      ]);
    }
    elements.push(rowElements.slice(0, -1));
    elements.push([
      <div
        style={{
          height: "2px",
          position: "relative",
          backgroundColor: "var(--logo-text)",
          gridArea: `h-line-${k}`,
        }}
      ></div>,
    ]);
  }
  elements = elements.slice(0, -1);
  const unitSize = `${60 / Math.max(rows, columns)}vmin`;
  const borderSize = `2px`;
  const gridGap = `10px`;
  return (
    <ViewportBox background={"var(--logo-gradient)"} style={{}}>
      <div
        className="grilled-cheese-grid"
        style={{
          display: "grid",
          gridAutoFlow: "row-reverse",
          gridTemplateColumns: new Array(columns)
            .fill(unitSize)
            .join(` ${borderSize} `),
          gridTemplateRows: new Array(rows)
            .fill(unitSize)
            .join(` ${borderSize} `),
          gridGap: gridGap,
          gridTemplateAreas: elements
            .map(
              (nodes: React.ReactHTMLElement<HTMLDivElement>[], i) =>
                `"${
                  i % 2 === 0
                    ? nodes.map((x) => x.props.style.gridArea).join(" ")
                    : new Array(columns + columns - 1)
                        .fill(nodes[0].props.style.gridArea)
                        .join(" ")
                }"`,
            )
            .join(" "),
          borderLeft: `${borderSize} solid var(--logo-text)`,
          borderBottom: `${borderSize} solid var(--logo-text)`,
          padding: gridGap,
          position: "relative",
        }}
      >
        {elements.reduce((acc, next) => acc.concat(next))}
      </div>
    </ViewportBox>
  );
}

function ViewportBox({
  children,
  background,
}: {
  children?: ReactNode;
  background?: React.HTMLAttributes<HTMLDivElement>["style"]["backgroundColor"];
  style?: React.HTMLAttributes<HTMLDivElement>["style"];
}) {
  return (
    <div
      style={{
        borderRadius: "5px",
        borderColor: "var(--content-bg)",
        borderStyle: "solid",
        display: "flex",
        width: "100%",
        background: background || "transparent",
        boxSizing: "border-box",
        minHeight: "50vmin",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        padding: `0.7em`,
        transform: "scale(100vw)",
      }}
    >
      <div
        style={
          {
            // width: "50vmin",
            // maxWidth: "100%",
          }
        }
      >
        {children}
      </div>
    </div>
  );
}
