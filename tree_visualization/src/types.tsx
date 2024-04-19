export interface Child {
    child_probability: string;
    child: Entity;
}

export interface Entity {
    term_type: string;
    term_tokens: string[];
    occurences: number[][];
    txt_range: number[][];
    children?: Child[]; 
}

export interface Result {
    original_txt: string;
    formatted_txt: string;
    words: string[];
    strats?: Entity[];
}

export interface TreeData {
    id: string;
    name: string;
    children : TreeData[];
}