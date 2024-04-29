import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../service/userService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalEditUser from './ModalEditUser';
import ModalConfirm from './ModalConfirm';
import "./TableUser.scss"
import _ from "lodash";
import { debounce } from 'lodash';
import { CSVLink, CSVDownload } from "react-csv"
import Papa from "papaparse"
import { toast } from 'react-toastify';
const TableUser = (props) => {
    const [listUser, setListUser] = useState({})
    const [totalUsers, setTotalUser] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isShowModalAddNew, setShowModalAddNew] = useState(false)
    const [isShowModalEdit, setShowModalEdit] = useState(false)
    const [isShowModalConfirm, setShowModalConfirm] = useState(false)
    const [dataUserEdit, setDataUserEdit] = useState({})
    const [dataUserDelete, setDataUserDelete] = useState({})
    const [sortBy, setSortBy] = useState('');
    const [sortField, setSortField] = useState('id')

    const [dataExport, setDataExport] = useState([])
    const handleClose = () => {
        setShowModalAddNew(false)
        setShowModalConfirm(false)
        setShowModalEdit(false)
    }
    const handleUpdateTable = (user) => {
        setListUser([user, ...listUser])
    }
    const handleEditUserFromModal = (user) => {
        let cloneListUser = _.cloneDeep(listUser)
        let index = listUser.findIndex(item => item.id === user.id)
        cloneListUser[index].first_name = user.first_name
        setListUser(cloneListUser)

    }

    const handleDeleteUserFromModal = (user) => {
        let cloneListUser = _.cloneDeep(listUser)
        cloneListUser = cloneListUser.filter(item => item.id !== user.id)
        setListUser(cloneListUser)

    }
    const handleEditUser = (user) => {
        setShowModalEdit(true)
        setDataUserEdit(user)


    }
    const handleDeleteUser = (user) => {
        setDataUserDelete(user)
        setShowModalConfirm(true)
    }

    useEffect(() => {
        getAllUser()

    }, [])

    const getAllUser = async (page) => {
        let res = await fetchAllUser(page);
        if (res && res.data) {
            setListUser(res.data)
            setTotalUser(res.total)
            setTotalPages(res.total_pages)
        }
    }
    const handlePageClick = (event) => {
        getAllUser(+event.selected + 1)
    };
    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);
        let cloneListUser = _.cloneDeep(listUser);
        cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy])
        setListUser(cloneListUser)

    }

    const handleSearch = debounce((event) => {
        let term = event.target.value;
        if (term) {
            let cloneListUser = _.cloneDeep(listUser);
            cloneListUser = cloneListUser.filter(item => item.email.includes(term))
            setListUser(cloneListUser)
        } else {
            getAllUser(1)
        }
    }, 500)

    const getUsersExport = (event, done) => {
        let result = [];
        if (listUser && listUser.length > 0) {
            result.push(["Id", "Email", "First name", 'Last name'])
            listUser.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.email;
                arr[2] = item.first_name;
                arr[3] = item.last_name;
                result.push(arr)
            })
            setDataExport(result)
            done()
        }
    }
    const handleImportCSV = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            if (file.type !== "text/csv") {
                toast.error("Only accept csv!")
                return
            }
            Papa.parse(file, {
                complete: (result) => {
                    let rawCSV = result.data;

                    if (rawCSV.length > 0) {
                        if (rawCSV[0] && rawCSV[0].length === 3) {
                            if (rawCSV[0][0] !== 'email'
                                || rawCSV[0][1] !== 'first_name'
                                || rawCSV[0][2] !== 'last_name') {
                                toast.error("Wrong format header CSV file !")
                            }
                            else {
                                let result = []
                                rawCSV.map((item, index) => {
                                    if (index > 0 && item.length === 3) {
                                        let obj = {};
                                        obj.email = item[0]
                                        obj.first_name = item[1]
                                        obj.last_name = item[2];
                                        result.push(obj)
                                    }

                                })
                                console.log(result)
                                setListUser(result)
                            }
                        } else {
                            toast.error("Wrong format CSV file !")
                        }
                    } else {
                        toast.error("Not found data on your CSV file !")
                    }
                }
            })
        }

    }

    return (<>
        <div className='my-3 add-new d-sm-flex'>
            <span className='' >  List Users :</span>
            <div className='mt-sm-0 mt-2'>
                <label className='btn btn-warning'
                    htmlFor='import-file'>
                    <i className='fa-solid fa-file-import mx-2'></i>Import
                </label>
                <input id="import-file"
                    hidden type='file'
                    onChange={(event) => handleImportCSV(event)}
                ></input>

                <CSVLink
                    data={dataExport}
                    filename={"user.csv"}
                    className="btn btn-primary mx-3"
                    asyncOnClick={true}
                    onClick={(event, done) => getUsersExport(event, done)}
                    target="_blank"
                >
                    <i className='fa-solid fa-file-arrow-down mx-2'></i> Export
                </CSVLink>

                <button onClick={() => setShowModalAddNew(true)}
                    className='btn btn-success'
                >
                    <i className='fa-solid fa-circle-plus mx-1'></i>   Add new</button>
            </div>
        </div>
        <div className='col-12 col-sm-4 my-3'>
            <input className='form-control' placeholder='Search user by email...'

                onChange={(event) => handleSearch(event)}
            ></input>
        </div>
        <div className="">
            <div className='customize-table'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <div className='sort-header'>
                                    <span>ID</span>
                                    <span>
                                        <i className="fa-solid fa-arrow-down-long"
                                            onClick={() =>
                                                handleSort('desc', 'id')
                                            }
                                        ></i>
                                        <i className="fa-solid fa-arrow-up-long"
                                            onClick={() => handleSort('asc', 'id')
                                            }
                                        ></i></span>
                                </div>
                            </th>
                            <th>
                                <div className='sort-header'>
                                    <span>Email</span>
                                    <span>
                                        <i className="fa-solid fa-arrow-down-long"
                                            onClick={() =>
                                                handleSort('desc', 'email')
                                            }
                                        ></i>
                                        <i className="fa-solid fa-arrow-up-long"
                                            onClick={() => handleSort('asc', 'email')
                                            }
                                        ></i></span>
                                </div>
                            </th>
                            <th>
                                <div className='sort-header'>
                                    <span>First name</span>
                                    <span>
                                        <i className="fa-solid fa-arrow-down-long"
                                            onClick={() =>
                                                handleSort('desc', 'first_name')
                                            }
                                        ></i>
                                        <i className="fa-solid fa-arrow-up-long"
                                            onClick={() => handleSort('asc', 'first_name')
                                            }
                                        ></i></span>
                                </div>
                            </th>
                            <th>
                                <div className='sort-header'>
                                    <span>Last name</span>
                                    <span>
                                        <i className="fa-solid fa-arrow-down-long"
                                            onClick={() =>
                                                handleSort('desc', 'last_name')
                                            }
                                        ></i>
                                        <i className="fa-solid fa-arrow-up-long"
                                            onClick={() => handleSort('asc', 'last_name')
                                            }
                                        ></i></span>
                                </div>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUser && listUser.length > 0 && listUser.map((item, index) => {
                            return (
                                <tr key={`user-${index}`}>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td>
                                        <button onClick={() => handleEditUser(item)} className='btn btn-warning mx-3'>Edit</button>
                                        <button onClick={() => handleDeleteUser(item)} className='btn btn-danger'>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}


                    </tbody>
                </Table>
            </div>
            <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPages}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />
            <ModalAddNew
                show={isShowModalAddNew}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTable}
            />
            <ModalEditUser
                show={isShowModalEdit}
                handleClose={handleClose}
                dataUserEdit={dataUserEdit}
                handleEditUserFromModal={handleEditUserFromModal}
            />
            <ModalConfirm
                show={isShowModalConfirm}
                handleClose={handleClose}
                dataUserDelete={dataUserDelete}
                handleDeleteUserFromModal={handleDeleteUserFromModal}
            />
        </div >
    </>);
}

export default TableUser;






