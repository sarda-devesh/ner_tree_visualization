import React from "react";
import { TextAnnotateBlend, AnnotateBlendTag } from "react-text-annotate-blend";
import { TreeData } from "./types";

/*
Stateful example with blended tags allowed
*/


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

type NAME_TO_LEVEL_TYPE = {
  [key: string] : number;
  strat_name: number;
  lithology: number;
  lith_att: number;
};

const NAME_TO_LEVEL : NAME_TO_LEVEL_TYPE = {
  strat_name: 0,
  lithology: 1,
  lith_att: 2,
}

type LEVEL_TO_NAME_TYPE = {
  [key : number] : string;
  0 : string;
  1 : string;
  2: string;
}

const LEVEL_TO_NAME : LEVEL_TO_NAME_TYPE = {
  0 : "strat_name",
  1: "lithology",
  2: "lith_att"
}

export interface StatefulBlendProps {
  formatted_text: string;
  tree_data: TreeData[];
  update_nodes: (nodes: string[]) => void;
};

function perform_dfs(current_node : TreeData, paragraph: string, all_tags : AnnotateBlendTag[]) {
  // Extract the data
  let parts = current_node.id.split("_");
  let level = parseInt(parts[0]);
  let tag = LEVEL_TO_NAME[level];
  let start_idx = parseInt(parts[1]);
  let end_idx = parseInt(parts[2]);

  // Record this node
  all_tags.push({
    start: start_idx,
    end: end_idx,
    text: paragraph.substring(start_idx, end_idx),
    tag: tag,
    color: COLORS[tag]
  });

  // Record the children
  if(current_node.children) {
    for(var node of current_node.children) {
      perform_dfs(node, paragraph, all_tags);
    }
  }
}

export function StatefulBlend(props : StatefulBlendProps) {
  // Convert input to tags
  let all_tags : AnnotateBlendTag[] = [];
  for(var data of props.tree_data) {
    perform_dfs(data, props.formatted_text, all_tags);
  }

  const tag = "strat_name";
  const handleChange = (tagged_words: AnnotateBlendTag[]) => {
    let nodes_to_keep : string[] = [];
    for(var curr_word of tagged_words) {
      // Get the word level
      let word_level : string = "0";
      if(curr_word.tag) {
        word_level = "" + NAME_TO_LEVEL[curr_word.tag];
      }

      // Record the node
      let node_id = word_level + "_" + curr_word.start.toString() + "_" + curr_word.end.toString();
      nodes_to_keep.push(node_id);
    }
    props.update_nodes(nodes_to_keep);
  };

  return (
    <div style={{ padding: 20 }}>
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
  );
}