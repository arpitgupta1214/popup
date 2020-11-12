import React from "react";

const Popup = (props) => {
  const inputFromField = (field) => {
    if (field.type === "select") {
      return (
        <select
          key={`input${field.name}`}
          placeholder={field.displayName || field.name}
          value={field.value}
          onChange={(e) => props.changeFieldValue(field.name, e.target.value)}
        >
          {field.options.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      );
    } else if (field.type === "text") {
      return (
        <input
          key={`input${field.name}`}
          type="text"
          placeholder={field.displayName || field.name}
          value={field.value}
          onChange={(e) => props.changeFieldValue(field.name, e.target.value)}
        ></input>
      );
    }
  };
  return (
    <div className={`popup`} key={props.divKey}>
      <form>
        {props.fields.map((field) => {
          if (!field.visible) {
            return;
          }
          return (
            <div className={`input${field.addable ? " addable" : ""}`}>
              {inputFromField(field)}
              {field.addable ? (
                <button
                  key={`add-${field.name}-button`}
                  className="tempButton"
                  type="button"
                  onClick={field.onAdd}
                >
                  +
                </button>
              ) : null}
            </div>
          );
        })}
      </form>
      <button
        key={`cancelFormButton`}
        className="tempButton"
        onClick={props.onCancel}
      >
        Cancel
      </button>
      <button
        key={`submitFormButton`}
        className="tempButton"
        onClick={props.onSubmit}
      >
        {props.addButtonText || "Add"}
      </button>
    </div>
  );
};

export default Popup;
