import { AiFillFolder, AiFillFile } from "react-icons/ai";
import { MdArrowRight, MdArrowDropDown, MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const Node = ({ node, style, dragHandle, tree } : any) => {
  const CustomIcon = node.data.icon;
  const iconColor = node.data.iconColor;

  // console.log(node, tree);
  return (
    <div
      className={`node-container ${node.state.isSelected ? "isSelected" : ""}`}
      style={style}
      ref={dragHandle}
    >

      <div
        className="node-content"
        onClick={() => node.isInternal && node.toggle()}
      >
        {node.isLeaf ? "🍁" : "🗀"}
        <span className="node-text">
          {node.isEditing ? (
            <input
              type="text"
              defaultValue={node.data.name}
              onFocus={(e) => e.currentTarget.select()}
              onBlur={() => node.reset()}
              onKeyDown={(e) => {
                if (e.key === "Escape") node.reset();
                if (e.key === "Enter") node.submit(e.currentTarget.value);
              }}
              autoFocus
            />
          ) : (
            <span>{node.data.name}</span>
          )}
          
          <button onClick={() => node.edit()} title="Rename...">
            <MdEdit />
          </button>
          <button onClick={() => tree.delete(node.id)} title="Delete">
            <RxCross2 />
          </button>
          
        </span>
      </div>
    </div>
  );
};

export default Node;
