import React, { useState, useEffect } from "react";
import "../css/Popup_temp.css";
import "../css/Domain.css";
import axios from "axios";

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
    displayPopup: false,
    options: { category: [], status: [] },
    formData: {
      _id: "",
      host: "",
      username: "",
      category: "",
      valid: "",
      type: "",
      status: "",
    },
    inputFields: ["host", "username", "type", "category", "valid", "status"],
  });

  const clearForm = () => {
    setPopupConfig((popupConfig) => {
      let formData = popupConfig.formData;
      for (let field in formData) {
        if (field != "status" && field != "category") {
          formData[field] = "";
        }
      }
      if ("_id" in formData) delete formData["_id"];
      ["status", "category"].forEach((field) => {
        formData[field] =
          field in popupConfig.options ? popupConfig.options[field][0] : "";
      });
      return { ...popupConfig, formData };
    });
  };
  const getOptions = async () => {
    const res = await fetch(`${backEndURL}/api/smtp/options`);
    const options = await res.json();
    let formData = popupConfig.formData;
    setPopupConfig({ ...popupConfig, options, formData });
  };

  const formSubmit = async () => {
    await fetch(
      `${backEndURL}/api/smtp/${popupConfig.formData["_id"] ? "edit" : "add"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(popupConfig.formData),
      }
    );
    clearForm();
    setPopupConfig((popupConfig) => {
      return { ...popupConfig, displayPopup: false };
    });
    fetchData();
  };
  useEffect(() => {
    if (popupConfig.displayPopup) {
      getOptions();
    }
  }, [popupConfig.displayPopup]);

  const [categoryPopupConfig, setCategoryPopupConfig] = useState({
    display: false,
    formData: {
      name: "",
    },
    inputFields: ["name"],
  });

  const clearCategoryForm = () => {
    setCategoryPopupConfig({
      ...categoryPopupConfig,
      formData: { ...categoryPopupConfig.formData, name: "" },
    });
  };

  const categoryFormSubmit = async () => {
    await fetch(`${backEndURL}/api/smtp/addcategory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryPopupConfig.formData),
    });
    clearCategoryForm();
    setCategoryPopupConfig((categoryPopupConfig) => {
      return { ...categoryPopupConfig, display: false };
    });
    setPopupConfig({ ...popupConfig, displayPopup: true });
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
                  console.log(e.target.value);
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
                setPopupConfig({ ...popupConfig, displayPopup: true });
              }}
            >
              Add New Domain
              <span>
                <i class="fa fa-plus" aria-hidden="true"></i>
              </span>
            </button>
          </div>

          <div>
            <button class="btn issues_history_dark">
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
                      setPopupConfig({
                        ...popupConfig,
                        displayPopup: true,
                        formData: { ...post },
                      });
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
        <div className={`popup ${popupConfig.displayPopup ? "active" : ""}`}>
          <form>
            {popupConfig.inputFields.map((head) => {
              if (head === "status") {
                return (
                  <select
                    key={`input${head}`}
                    placeholder={head}
                    name={head}
                    value={popupConfig.formData[head]}
                    onChange={(e) => {
                      setPopupConfig({
                        ...popupConfig,
                        formData: {
                          ...popupConfig.formData,
                          [head]: e.target.value,
                        },
                      });
                    }}
                  >
                    {popupConfig.options[head].map((option) => (
                      <option value={option}>{option}</option>
                    ))}
                  </select>
                );
              } else if (head === "category") {
                return (
                  <div className="category">
                    <select
                      key={`input${head}`}
                      placeholder={head}
                      name={head}
                      value={popupConfig.formData[head]}
                      onChange={(e) => {
                        setPopupConfig({
                          ...popupConfig,
                          formData: {
                            ...popupConfig.formData,
                            [head]: e.target.value,
                          },
                        });
                      }}
                    >
                      {popupConfig.options[head].map((option) => (
                        <option value={option}>{option}</option>
                      ))}
                    </select>
                    <button
                      key={`addCategoryButton`}
                      className="tempButton"
                      type="button"
                      onClick={() => {
                        setPopupConfig({ ...popupConfig, displayPopup: false });
                        setCategoryPopupConfig({
                          ...categoryPopupConfig,
                          display: true,
                        });
                      }}
                    >
                      +
                    </button>
                  </div>
                );
              } else {
                return (
                  <input
                    key={`input${head}`}
                    type="text"
                    placeholder={head}
                    name={head}
                    value={popupConfig.formData[head]}
                    onChange={(e) => {
                      setPopupConfig({
                        ...popupConfig,
                        formData: {
                          ...popupConfig.formData,
                          [head]: e.target.value,
                        },
                      });
                    }}
                  ></input>
                );
              }
            })}
          </form>
          <button
            key={`cancelFormButton`}
            className="tempButton"
            onClick={() => {
              clearForm();
              setPopupConfig((popupConfig) => {
                return { ...popupConfig, displayPopup: false };
              });
            }}
          >
            Cancel
          </button>
          <button
            key={`submitFormButton`}
            className="tempButton"
            onClick={formSubmit}
          >
            {popupConfig.formData["_id"] ? "Edit" : "Add"}
          </button>
        </div>
        <div
          className={`popup categoryPopup ${
            categoryPopupConfig.display ? "active" : ""
          }`}
        >
          <form>
            <input
              type="text"
              placeholder="Category Name"
              value={categoryPopupConfig.formData.name}
              onChange={(e) =>
                setCategoryPopupConfig({
                  ...categoryPopupConfig,
                  formData: {
                    ...categoryPopupConfig.formData,
                    name: e.target.value,
                  },
                })
              }
            ></input>
            <select>
              <option value="nonip">Non IP Category</option>
              <option value="ip">IP Category</option>
            </select>
          </form>
          <button
            key={`cancelCategoryFormButton`}
            className="tempButton"
            onClick={() => {
              clearCategoryForm();
              setCategoryPopupConfig((categoryPopupConfig) => {
                return { ...categoryPopupConfig, display: false };
              });
              setPopupConfig({ ...popupConfig, displayPopup: true });
            }}
          >
            Cancel
          </button>
          <button
            key={`submitCategoryFormButton`}
            className="tempButton"
            onClick={() => categoryFormSubmit()}
          >
            {"Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
