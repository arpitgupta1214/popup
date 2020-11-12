import React, { useState, useEffect } from "react";
import "../css/Popup_temp.css";
import "../css/Domain.css";
import axios from "axios";
import Popup from "./Popup";

export default function Senders() {
  const backEndURL = "http://localhost:5000";
  const [data, setData] = useState({
    smtpLists: [],
    page: 1,
    totalPages: null,
    pages: [1],
    totalEntries: null,
  });

  const [config, setConfig] = useState({
    keyword: null,
    pageSize: 10,
    page: 1,
    sortField: null,
    sortDirection: null,
  });

  const tableHeads = [
    { name: "#", field: "snum" },
    { name: "Host", field: "host", sortable: true },
    { name: "Username", field: "username", sortable: true },
    { name: "Type", field: "type", sortable: true },
    { name: "Category", field: "category", sortable: true },
    { name: "Valid", field: "valid" },
    { name: "Status", field: "status" },
    { name: "Action", field: null },
  ];

  const fetchData = async () => {
    const res = await axios.get(`${backEndURL}/api/smtp`, {
      params: config,
    });
    setData(res.data);
  };

  useEffect(fetchData, [config]);

  const setSortField = (sortField) => {
    if (sortField) {
      let sortDirection = 1;
      if (config.sortField == sortField && config.sortDirection == 1) {
        sortDirection = -1;
      }
      setConfig({ ...config, sortField, sortDirection });
    }
  };

  const [popupConfig, setPopupConfig] = useState({
    display: false,
    fields: [
      { name: "_id", value: "", type: "text", visible: false },
      { name: "host", value: "", type: "text", visible: true },
      {
        name: "username",
        value: "",
        type: "text",
        visible: true,
      },
      {
        name: "category",
        value: "",
        type: "select",
        options: [],
        visible: true,
        addable: true,
        onAdd: () => {
          setPopupConfig((popupConfig) => ({ ...popupConfig, display: false }));
          setCategoryPopupConfig((categoryPopupConfig) => ({
            ...categoryPopupConfig,
            display: true,
          }));
        },
      },
      { name: "valid", value: "", type: "text", visible: true },
      { name: "type", value: "smtp", type: "text", visible: false },
      {
        name: "status",
        value: "",
        type: "select",
        options: [],
        visible: true,
      },
    ],
  });

  const clearForm = (setPopupConfig, avoid) =>
    setPopupConfig((popupConfig) => {
      let fields = popupConfig.fields;
      fields.forEach((field) => {
        if (avoid && avoid.indexOf(field.name) > -1) {
          return;
        }

        switch (field.type) {
          case "text":
            field.value = "";
            break;
          case "select":
            field.value = field.options.length > 0 ? field.options[0] : "";
            break;
          default:
            field.value = "";
            break;
        }
      });
      return { ...popupConfig, fields };
    });

  const getOptions = async (setPopupConfig) => {
    const res = await fetch(`${backEndURL}/api/smtp/options`);
    const options = await res.json();

    setPopupConfig((popupConfig) => {
      const fields = popupConfig.fields;
      for (let optionField in options) {
        fields.find((field) => field.name === optionField).options =
          options[optionField];
      }
      return { ...popupConfig, fields };
    });
  };

  const dataFromConfig = (popupConfig) => {
    const formData = {};
    popupConfig.fields.forEach((field) => {
      if (field.value) {
        formData[field.name] = field.value;
      }
    });
    return formData;
  };

  const submitForm = async () => {
    const formData = {};

    popupConfig.fields.forEach((field) => {
      console.log(popupConfig.fields, field);
      if (field.value) {
        formData[field.name] = field.value;
      }
    });
    console.log(formData);

    await fetch(
      `${backEndURL}/api/smtp/${
        popupConfig.fields.find((field) => field.name === "_id").value
          ? "edit"
          : "add"
      }`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    clearForm(setPopupConfig, ["type"]);
    setPopupConfig((popupConfig) => {
      return { ...popupConfig, display: false };
    });
    fetchData();
  };

  const cancelForm = () => {
    clearForm(setPopupConfig, ["type"]);
    setPopupConfig((popupConfig) => {
      return { ...popupConfig, display: false };
    });
  };

  const changeFormField = (fieldName, value) => {
    setPopupConfig((popupConfig) => {
      const fields = popupConfig.fields;
      fields.find((field) => field.name === fieldName).value = value;
      return { ...popupConfig, fields };
    });
  };

  const [categoryPopupConfig, setCategoryPopupConfig] = useState({
    display: false,
    fields: [
      { name: "name", type: "text", visible: true, value: "" },
      {
        name: "category",
        type: "select",
        options: ["IP Category", "Non-IP Category"],
        visible: true,
        value: "IP Category",
      },
    ],
  });

  const clearCategoryForm = () => {
    clearForm(setCategoryPopupConfig);
  };

  const submitCategoryForm = async () => {
    const formData = dataFromConfig(categoryPopupConfig);
    await fetch(`${backEndURL}/api/smtp/addcategory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    clearForm(setCategoryPopupConfig);
    setCategoryPopupConfig((categoryPopupConfig) => {
      return { ...categoryPopupConfig, display: false };
    });
    setPopupConfig({ ...popupConfig, display: true });
  };
  const cancelCategoryForm = () => {
    clearCategoryForm();
    setPopupConfig((popupConfig) => {
      return { ...popupConfig, display: true };
    });
    setCategoryPopupConfig((categoryPopupConfig) => {
      return { ...categoryPopupConfig, display: false };
    });
  };
  const changeCategoryFormField = (fieldName, value) => {
    setCategoryPopupConfig((categoryPopupConfig) => {
      const fields = categoryPopupConfig.fields;
      fields.find((field) => field.name === fieldName).value = value;
      return { ...categoryPopupConfig, fields };
    });
  };

  const [senderPopupConfig, setSenderPopupConfig] = useState({
    display: false,
    fields: [
      { name: "_id", value: "", type: "text", visible: false },
      {
        name: "host",
        displayName: "SMTP Host",
        value: "",
        type: "text",
        visible: true,
      },
      {
        name: "username",
        displayName: "Email",
        value: "",
        type: "text",
        visible: true,
      },
      {
        name: "port",
        displayName: "Port",
        value: "",
        type: "text",
        visible: true,
      },
      {
        name: "category",
        value: "",
        type: "select",
        options: [],
        visible: true,
        addable: true,
        onAdd: () => {
          setSenderPopupConfig((senderPopupConfig) => ({
            ...senderPopupConfig,
            display: false,
          }));
          setCategoryPopupConfig((categoryPopupConfig) => ({
            ...categoryPopupConfig,
            display: true,
          }));
        },
      },
      { name: "valid", value: "", type: "text", visible: true },
      { name: "type", value: "postal", type: "text", visible: false },
      {
        name: "status",
        value: "",
        type: "select",
        options: [],
        visible: true,
      },
    ],
  });

  const clearSenderForm = () => {
    clearForm(setSenderPopupConfig, ["type"]);
  };

  const submitSenderForm = async () => {
    const formData = dataFromConfig(senderPopupConfig);
    console.log(formData);
    await fetch(
      `${backEndURL}/api/smtp/${
        senderPopupConfig.fields.find((field) => field.name === "_id").value
          ? "edit"
          : "add"
      }`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    clearSenderForm();
    setSenderPopupConfig((senderPopupConfig) => ({
      ...senderPopupConfig,
      display: false,
    }));
    fetchData();
  };
  const cancelSenderForm = () => {
    clearCategoryForm();
    setSenderPopupConfig((senderPopupConfig) => ({
      ...senderPopupConfig,
      display: false,
    }));
  };
  const changeSenderFormField = (fieldName, value) => {
    setSenderPopupConfig((senderPopupConfig) => {
      const fields = senderPopupConfig.fields;
      fields.find((field) => field.name === fieldName).value = value;
      return { ...senderPopupConfig, fields };
    });
  };

  useEffect(() => {
    getOptions(setPopupConfig);
    getOptions(setSenderPopupConfig);
  }, [popupConfig.display, senderPopupConfig.display]);

  const editForm = (setPopupConfig, post) => {
    setPopupConfig((popupConfig) => {
      const fields = popupConfig.fields;
      for (let i in post) {
        let configField = fields.find((field) => field.name === i);
        if (configField) {
          configField.value = post[i];
        }
      }
      return { ...popupConfig, display: true, fields };
    });
  };

  return (
    <div>
      <div>
        <div class="table_elements">
          <div className="show_entries">
            <label for="">Show</label>

            <span>
              <select
                class="en_selectbox"
                onChange={(e) => {
                  setConfig({ ...config, pageSize: e.target.value });
                }}
              >
                <option>10</option>
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </span>
            <span className="items">items</span>
          </div>

          <div>
            <button
              class="btn issues_history_dark"
              onClick={() => {
                clearForm(setPopupConfig, ["type"]);
                setPopupConfig((popupConfig) => ({
                  ...popupConfig,
                  display: true,
                }));
                setCategoryPopupConfig((categoryPopupConfig) => ({
                  ...categoryPopupConfig,
                  display: false,
                }));
                setSenderPopupConfig((senderPopupConfig) => ({
                  ...senderPopupConfig,
                  display: false,
                }));
              }}
            >
              Add New Domain
              <span>
                <i class="fa fa-plus" aria-hidden="true"></i>
              </span>
            </button>
          </div>

          <div>
            <button
              class="btn issues_history_dark"
              onClick={() => {
                clearForm(setSenderPopupConfig, ["type"]);
                setPopupConfig((popupConfig) => ({
                  ...popupConfig,
                  display: false,
                }));
                setCategoryPopupConfig((categoryPopupConfig) => ({
                  ...categoryPopupConfig,
                  display: false,
                }));
                setSenderPopupConfig((senderPopupConfig) => ({
                  ...senderPopupConfig,
                  display: true,
                }));
              }}
            >
              Import Senders
              <span>
                <i class="fa fa-download" aria-hidden="true"></i>
              </span>
            </button>
          </div>

          <div className="search_div">
            <input
              className="search"
              placeholder="Search"
              name="q"
              onChange={(e) =>
                setConfig({ ...config, keyword: e.target.value })
              }
            />
            <span>
              <i class="fa fa-search search" aria-hidden="true"></i>
            </span>
          </div>
        </div>

        <table className="table table-striped">
          <thead>
            <tr className="table_header">
              {tableHeads.map((head) => (
                <th
                  key={`th-${head.name}`}
                  onClick={() => {
                    if (head.sortable) setSortField(head.field);
                  }}
                >
                  {head.name}
                  {head.sortable ? (
                    <React.Fragment>
                      <span>
                        <i
                          style={{ paddingLeft: "0.5rem" }}
                          class="fa fa-long-arrow-up"
                          aria-hidden="true"
                        ></i>
                      </span>
                      <span>
                        <i
                          style={{ paddingLeft: "0.2rem" }}
                          class="fa fa-long-arrow-down"
                          aria-hidden="true"
                        ></i>
                      </span>
                    </React.Fragment>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.smtpLists.map((post, i) => (
              <tr key={`tr-${post["_id"]}`}>
                {tableHeads.map((head) => {
                  if (head.field !== null)
                    return (
                      <td key={`${post.id}-${head.field}`}>
                        {post[head.field]}
                      </td>
                    );
                })}
                <td>
                  <button
                    style={{ background: "white", color: "black" }}
                    onClick={() => {
                      if (!post.type) {
                        return;
                      }
                      if (post.type === "smtp") {
                        editForm(setSenderPopupConfig, post);
                      } else if (post.type === "postal") {
                        editForm(setPopupConfig, post);
                      }
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <a
            onClick={() => {
              if (config.page > 1)
                setConfig({ ...config, page: config.page - 1 });
            }}
          >
            &laquo;
          </a>
          {data.pages.map((pageNum) => {
            if (pageNum === "prev3" || pageNum === "next3") {
              return (
                <a
                  onClick={() =>
                    setConfig({
                      ...config,
                      page:
                        pageNum === "prev3" ? config.page - 3 : config.page + 3,
                    })
                  }
                >
                  ...
                </a>
              );
            } else {
              return (
                <a
                  className={data.page === pageNum ? "active" : ""}
                  onClick={() => setConfig({ ...config, page: pageNum })}
                >
                  {pageNum}
                </a>
              );
            }
          })}

          <a
            onClick={() => {
              if (config.page < data.totalPages)
                setConfig({ ...config, page: config.page + 1 });
            }}
          >
            &raquo;
          </a>
        </div>
        <div className="show_entery">
          <p>
            Show entries{" "}
            <a href="#">
              {config.pageSize}/{data.totalEntries}
            </a>
          </p>
        </div>
        {popupConfig.display ? (
          <Popup
            divKey="domainPopup"
            fields={popupConfig.fields}
            changeFieldValue={changeFormField}
            onCancel={cancelForm}
            onSubmit={submitForm}
            addButtonText={
              popupConfig.fields.find((field) => field.name === "_id").value
                ? "Edit"
                : "Add"
            }
          ></Popup>
        ) : null}
        {categoryPopupConfig.display ? (
          <Popup
            divKey="categoryPopup"
            fields={categoryPopupConfig.fields}
            changeFieldValue={changeCategoryFormField}
            onCancel={cancelCategoryForm}
            onSubmit={submitCategoryForm}
          ></Popup>
        ) : null}
        {senderPopupConfig.display ? (
          <Popup
            divKey="senderPopup"
            fields={senderPopupConfig.fields}
            changeFieldValue={changeSenderFormField}
            onCancel={cancelSenderForm}
            onSubmit={submitSenderForm}
            addButtonText={
              popupConfig.fields.find((field) => field.name === "_id").value
                ? "Edit"
                : "Add"
            }
          ></Popup>
        ) : null}
      </div>
    </div>
  );
}
