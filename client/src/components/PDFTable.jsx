import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { addQueryParams } from "../redux/actions/queryParamAction";
import { getPDFS, deletePDFS } from "../redux/actions/pdfAction";
import Loading from "./Loading";
import Error from "./Error";
import PDFModal from "./PDFModal";
import DeleteModal from "./DeleteModal";

const _THEAD_ = {
  pid: "管理番号",
  problem: "問題集",
  unit: "単元",
  type: "演習・復習",
  url: "埋め込みリンク URL",
};

const PDFTable = () => {
  const dispatch = useDispatch();
  const token = useSelector((store) => store.authReducer.token);
  const data = useSelector((store) => store.PDFReducer.pdfs, shallowEqual);
  const params = useSelector((store) => store.queryParamReducer, shallowEqual);
  const [queryParams, setQueryParams] = useState(params);

  useEffect(() => {
    dispatch(getPDFS(queryParams, token));
    dispatch(addQueryParams(queryParams, token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    queryParams.page,
    queryParams.limit,
    queryParams.sort,
    queryParams.order,
    data.length,
    data.totalPdf,
  ]);

  useEffect(() => {
    setQueryParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, params.sort, params.order]);

  const handleSortChange = (key) => {
    setQueryParams({
      ...queryParams,
      sort: key,
      order: queryParams.order === 1 ? -1 : 1,
    });
  };

  // Modal state, crud state and selected id
  const [userModalIsOpen, setUserModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [crudState, setCrudState] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const closeUserModal = () => {
    setUserModalIsOpen(false);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setDeleteModalIsOpen(true);
  };

  // Handle edit and delete
  const handleEdit = (id) => {
    setUserModalIsOpen(true);
    const pdf = data.find((pdf) => pdf._id === id);
    setSelectedPdf(pdf);
    setCrudState("update");
  };

  const handleOK = () => {
    dispatch(deletePDFS(selectedId, token));
    closeDeleteModal();
  };

  return data.isLoading ? (
    <Loading />
  ) : data.isError ? (
    <Error />
  ) : (
    <>
      <div className="w-full bg-transparent shadow-none flex-col my-3">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {Object.keys(_THEAD_).map((key) => (
                <th
                  key={key}
                  className="border-y border-blue-gray-100 bg-gray-200 p-4"
                >
                  <div className="leading-none opacity-70 font-bold text-gray-800 grid grid-flow-col justify-between">
                    <span>{_THEAD_[key]}</span>
                    {key === "url" ? (
                      ""
                    ) : (
                      <button onClick={() => handleSortChange(key)}>
                        <i
                          className={
                            queryParams.sort === key
                              ? queryParams.order === 1
                                ? "fa fa-sort-up"
                                : "fa fa-sort-down"
                              : "fa fa-sort"
                          }
                        ></i>
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th
                key="edit"
                className="border-y border-blue-gray-100 bg-gray-200 p-4"
              >
                <div className="leading-none opacity-70 font-bold text-gray-800 grid grid-flow-col justify-between">
                  <span>編集</span>
                  <button onClick={handleSortChange}></button>
                </div>
              </th>
              <th
                key="delete"
                className="border-y border-blue-gray-100 bg-gray-200 p-4"
              >
                <div className="leading-none opacity-70 font-bold text-gray-800 grid grid-flow-col justify-between">
                  <span>削除</span>
                  <button onClick={handleSortChange}></button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => {
              const isLast = index === data.length - 1;
              const classes = isLast
                ? "p-2"
                : "p-2 border-b border-blue-gray-50";

              return (
                <tr key={record._id} className="even:bg-gray-50">
                  {Object.keys(_THEAD_).map((key) => {
                    return (
                      <td key={key} className={classes}>
                        <div className="leading-none opacity-70 font-bold text-gray-800">
                          {key === "created"
                            ? record[key].split("T")[0]
                            : record[key]}
                        </div>
                      </td>
                    );
                  })}
                  <td className={classes}>
                    <button onClick={() => handleEdit(record._id)}>
                      <i className="h-4 w-4 fa fa-edit ml-3 text-gray-700" />
                    </button>
                  </td>
                  <td className={classes}>
                    <button onClick={() => handleDelete(record._id)}>
                      <i className="h-4 w-4 fa fa-trash-can ml-3 text-gray-700" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PDFModal
        modalIsOpen={userModalIsOpen}
        crudState={crudState}
        selectedPdf={selectedPdf}
        closeModal={closeUserModal}
      />
      <DeleteModal
        modalIsOpen={deleteModalIsOpen}
        closeModal={closeDeleteModal}
        handleOK={handleOK}
      />
    </>
  );
};

export default PDFTable;
