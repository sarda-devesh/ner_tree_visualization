import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import example_data from './tree_example.json';
import {StatefulBlendProps, StatefulBlend} from './TextVisualizer';
import { Tree, TreeApi } from "react-arborist";
import Node from './Node';
import {Entity, Child, Result, TreeData} from './types';
import { TextAnnotateBlend, AnnotateBlendTag } from "react-text-annotate-blend";

const initial_data: Result = example_data;

function process_entity(paragraph : string, entity : Entity, depth: number) : TreeData {
  // Record its children
  let curr_children : TreeData[] = [];
  if(entity.children) {
    for(var child of entity.children) {
      curr_children.push(process_entity(paragraph, child.child, depth + 1));
    }
  }

  // Create the current node
  let entity_tag = "" + depth;
  return {
    id : entity_tag + "_"  + entity.txt_range[0][0] + "_" + entity.txt_range[0][1],
    name: paragraph.substring(entity.txt_range[0][0], entity.txt_range[0][1]),
    children : curr_children
  }
} 

function formatForVisualization() : [string, TreeData[]] {
  let paragraph : string = initial_data["formatted_txt"];
  let tree_entities : TreeData[] = [];
  if(initial_data.strats) {
    for(var curr_strat of initial_data.strats) {
      tree_entities.push(process_entity(paragraph, curr_strat, 0));
    }
  }

  let root : TreeData = {
    id : "root",
    name : "",
    children : tree_entities
  };

  return [paragraph, [root]];
}

function update_tree(current_node: TreeData, nodes_set: Set<string>)  {
    // Update the children
    let new_children : TreeData[] = [];
    for(var curr_child of current_node.children) {
      if(nodes_set.has(curr_child.id)) {
        // We want to keep this child
        new_children.push(curr_child);
        nodes_set.delete(curr_child.id);
      } else {
        // We don't want to keep this node so make its grand children its child
        for(var grand_child of curr_child.children) {
          nodes_set.delete(grand_child.id);
          new_children.push(grand_child);
        }
      }
    }

    // Call update on each of the children
    for(var curr_new_child of new_children) {
      update_tree(curr_new_child, nodes_set);
    }

    // Update the children of this node
    current_node.children = new_children;
}

function perform_reset(node : TreeData, depth: number) {
  // Reset the depth
  let old_id_parts = node.id.split("_");
  let new_id = depth.toString() + "_" + old_id_parts[1] + "_" + old_id_parts[2];
  node.id = new_id;

  for(var child of node.children) { 
    perform_reset(child, depth + 1);
  }
}

function App() {
  let [current_text, tree_entities] : [string, TreeData[]] = formatForVisualization();
  let [current_tree, setTree] = React.useState(tree_entities);

  let process_update = (nodes: string[]) => {
      let nodes_set = new Set<string>(nodes);
      let old_root = current_tree[0];
      let new_root = JSON.parse(JSON.stringify(old_root));
      
      // Update the tree
      update_tree(new_root, nodes_set);
      
      // Add the remaining children as 
      nodes_set.forEach((node) => {
        // Get the id details
        let node_parts = node.split("_");
        let start_idx : number = parseInt(node_parts[1]);
        let end_idx : number = parseInt(node_parts[2]);

        // Create the new node 
        let new_id : string = "0_" + start_idx.toString() + "_" + end_idx.toString();
        let name : string = current_text.substring(start_idx, end_idx);
        new_root.children.push({
          id : new_id,
          name : name,
          children: []
        })
      });
      
      // Reset the level of all of nodes
      for(var root_child of new_root.children) {
        perform_reset(root_child, 0);
      }

      setTree([new_root]);
  };

  return (
  <>
    <div style={{display:"grid",  gridTemplateColumns:"1fr 1fr"}}>
      <StatefulBlend formatted_text={current_text} tree_data={current_tree[0].children} update_nodes={process_update} />
    </div>
  </>
  );

}

export default App;
