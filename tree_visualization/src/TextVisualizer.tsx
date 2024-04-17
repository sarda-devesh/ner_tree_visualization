import React from "react";
import { TextAnnotateBlend, AnnotateBlendTag } from "react-text-annotate-blend";

/*
Stateful example with blended tags allowed
*/

const init: AnnotateBlendTag[] = [
  {
    start: 10,
    end: 22,
    text: "many stories",
    tag: "tagC",
    color: "#4b46cd",
  },
  {
    start: 15,
    end: 28,
    text: "stories about",
    tag: "tagB",
    color: "#42f5f5",
  },
  {
    start: 120,
    end: 124,
    text: "each",
    tag: "tagC",
    color: "#4b46cd",
  },
];

const demoText = "There are many stories about the origins of cyclo-cross. One is that European road racers in the early 1900s would race each other to the next town over from them and that they were allowed to cut through farmers' fields or over fences, or take any other shortcuts, in order to make it to the next town first. This was sometimes called steeple chase as the only visible landmark in the next town was often the steeple.";

type COLOR_TYPE = {
  [key: string]: string;
  strat_name: string;
  lithology: string;
  lith_att: string;
};

const COLORS: COLOR_TYPE = {
  strat_name: "rgb(179, 245, 66)",
  lithology: "#42f5f5",
  lith_att: "#4b46cd",
};

export interface VisualizeEntity {
  start_range: number;
  end_range: number;
  text: string;
  tag: string;
}

export interface StatefulBlendProps {
  formatted_text: string;
  entities_to_visualize: VisualizeEntity[];
}



export function StatefulBlend(props : StatefulBlendProps) {
  // Convert input to tags
  let all_tags : AnnotateBlendTag[] = [];
  for(var entity of props.entities_to_visualize) {
    all_tags.push({
      start : entity.start_range,
      end : entity.end_range,
      text : entity.text,
      tag : entity.tag,
      color : COLORS[entity.tag]
    });
  }
  console.log(all_tags);

  const [tag, setTag] = React.useState("strat_name");

  const handleChange = (value: AnnotateBlendTag[]) => {
    console.log(value);
  };

  return (
    <div style={{ padding: 20 }}>
      <select style={{ margin: 20 }} onChange={(e) => setTag(e.target.value)}>
        {Object.keys(COLORS).map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>

      <br></br>

      <div>
        <TextAnnotateBlend
          style={{
            fontSize: "1.2rem",
          }}
          content={props.formatted_text}
          onChange={handleChange}
          value={all_tags}
          getSpan={(span) => ({
            ...span,
            tag: tag,
            color: COLORS[tag],
          })}
        />
      </div>

      <h3>Current Stored Value</h3>
      <div>
        <pre>{JSON.stringify(all_tags, null, 2)}</pre>
      </div>
    </div>
  );
}