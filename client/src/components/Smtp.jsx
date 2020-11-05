import React, { useState, useEffect } from "react";
import "../css/Domain.css";
import axios from "axios";
export default function Senders() {
  const [data, setData] = useState({
    smtpLists: [],
    page: 1,
    totalPages: null,
    pages: [1, 2, 3, 4, 5],
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
    { name: "#" },
    { name: "Host", sortField: "Host" },
    { name: "userName", sortField: "userName" },
    { name: "TYPE", sortField: "TYPE" },
    { name: "CATEGORY", sortField: "CATEGORY" },
    { name: "VALID" },
    { name: "STATUS" },
    { name: "ACTION" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:5000/api/smtp`, {
        params: config,
      });
      setData(res.data);
    };
    fetchData();
  }, [config]);
  const setSortField = (sortField) => {
    if (sortField) {
      let sortDirection = 1;
      if (config.sortField == sortField && config.sortDirection == 1) {
        sortDirection = -1;
      }
      setConfig({ ...config, sortField, sortDirection });
    }
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
            <button class="btn issues_history_dark">
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
            {tableHeads.map((head) =>(
              <th onClick={() => setSortField(head.sortField)}>
                {head.name}
                {head.sortField ? (
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
            <tr>
              <td key={post.id}>{post.snum}</td>
              <td>{post.host}</td>
              <td>{post.userName}</td>
              <td>smtp</td>
              <td>{post.category}</td>
              <td>valid</td>
              <td>Active</td>
              <td>
                <i style={{ color: "white" }} class="fa fa-pencil-square-o"></i>
                <i
                  style={{ paddingLeft: "1.5rem", color: "white" }}
                  class="fa fa-share-square-o"
                ></i>
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
     
      </div>
    </div>
  );
}
