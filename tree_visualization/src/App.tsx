import React from 'react';
import logo from './logo.svg';
import './App.css';
import example_data from './tree_example.json';
import {VisualizeEntity, StatefulBlendProps, StatefulBlend} from './TextVisualizer';
import {Entity, Child, Result} from './types';
import { TextAnnotateBlend, AnnotateBlendTag } from "react-text-annotate-blend";

const initial_data: Result = example_data;

function get_type_of_entity(input : Entity) : string {
  let type = input.term_type;
  if(type.startsWith("strat")) {
    return "strat_name";
  } else if(type.startsWith("lith")) {
    return "lithology";
  }
  return "lith_att";
}

function process_entity(paragraph : string, entity : Entity, entities_to_visualize : VisualizeEntity[]) {
  // Record this entity
  let entity_tag = get_type_of_entity(entity);
  for(var curr_range of entity.txt_range) {
    let start_idx = curr_range[0]; let end_idx = curr_range[1];
    entities_to_visualize.push({
      start_range : start_idx,
      end_range : end_idx,
      tag : entity_tag,
      text : paragraph.substring(start_idx, end_idx)
    })
  }

  // Record its children
  if(entity.children) {
    for(var child of entity.children) {
      process_entity(paragraph, child.child, entities_to_visualize);
    }
  }
} 

function formatForVisualization() : StatefulBlendProps {
  let paragraph : string = initial_data["formatted_txt"];
  let entities_to_visualize : VisualizeEntity[] = [];
  if(initial_data.strats) {
    for(var curr_strat of initial_data.strats) {
      process_entity(paragraph, curr_strat, entities_to_visualize);
    }
  }

  return {
    formatted_text : paragraph,
    entities_to_visualize : entities_to_visualize
  };
}

function App() {

  return (
    <StatefulBlend {... formatForVisualization()} />
  );
  
}

export default App;
