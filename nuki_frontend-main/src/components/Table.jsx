import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import { GET_ALL_LOCKS, GET_ALL_RESOURCES, ASSIGN_LOCK, REMOVE_LOCK } from "../constants/defaultValues";
import {
  Modal,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import toast, { Toaster } from 'react-hot-toast';
import "../assets/css/table.css";

const Table = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  //token
  const token = searchParams.get('token');

  //resources
  const [resources, setResources] = useState([]);
  const [resourceId, setResourceId] = useState(null);

  //locks
  const [allLocks, setAllLocks] = useState([]);
  const [lockId, setLockId] = useState("");

  //unlock types
  const [unlockTypes, setUnlockTypes] = useState([
    { name: "Open", value: "open" },
    { name: "Open + Unlock", value: "unlatch" }
  ])
  const [unlockType, setUnlockType] = useState({name: "", value: ""});
  const [unlockType1, setUnlockType1] = useState("");

  //modals
  const [assignLockModal, setAssignLockModal] = useState(false);
  const [editLockModal, setEditLockModal] = useState(false);
  const [removeLockModal, setRemoveLockModal] = useState(false);

  //dropdown
  const [dropdownOpen, setDropdownOpen] = useState({ resource_id: null, status: false });

  //loading
  const [getResourcesLoading, setGetResourcesLoading] = useState(false);
  const [assignLockBtnLoading, setAssignLockBtnLoading] = useState(false);
  const [editLockBtnLoading, setEditLockBtnLoading] = useState(false);
  const [removeLockBtnLoading, setRemoveLockBtnLoading] = useState(false);

  const getAllResources = async () => {
    if (token === null) {
      return;
    }

    setGetResourcesLoading(true);

    try {
      const response = await axios.post(`${GET_ALL_RESOURCES}`,
        JSON.stringify({
          token: token
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
          },
          withCredentials: true
        }
      );

      // console.log(response?.data)
      setGetResourcesLoading(false);
      setResources(response?.data);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(`${err?.message}`);
    }
  }

  const getAllLocks = async () => {
    try {
      const response = await axios.get(`${GET_ALL_LOCKS}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
          }
        }
      );

      // console.log(response?.data)
      setAllLocks(response?.data);
      // setLockId(response?.data[0]?.smartlockId);
      return response;
    } catch (err) {
      console.log(err);
      toast.error(`${err?.message}`);
    }
  }

  const assignLock = async () => {
    if (lockId === null || resourceId === null || lockId === "" || unlockType1 === "" || unlockType1 === null || unlockType1 === undefined) {
      toast.error("Please select all fields!");
      return;
    }

    setAssignLockBtnLoading(true);

    try {
      const response = await axios.post(`${ASSIGN_LOCK}${resourceId}`,
        JSON.stringify(
          {
            lock_id: lockId.split("-")[0],
            unlock_type: unlockType1,
            lock_name: lockId.split("-")[1]
          }
        ),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
          }
        }
      );

      // console.log(response?.data)
      if (response?.data?.status === "ok") {
        toast.success(`${response?.data?.message}`);
      } else {
        toast.error(`${response?.data?.message}`);
      }
      setAssignLockBtnLoading(false);
      setAssignLockModal(false);
      getAllResources();
      return response;
    } catch (err) {
      console.log(err);
      toast.error(`${err?.message}`);
    }
  }

  const editLock = async () => {
    if (lockId === null || resourceId === null || lockId === "" || unlockType.value === "" || unlockType.value === null || unlockType.value === undefined) {
      toast.error("Please select all fields!");
      return;
    }

    // console.log({
    //   lock_id: lockId.split("-")[0],
    //   unlock_type: unlockType.value,
    //   lock_name: lockId.split("-")[1]
    // })

    setEditLockBtnLoading(true);

    try {
      const response = await axios.put(`${ASSIGN_LOCK}${resourceId}`,
        JSON.stringify(
          {
            lock_id: lockId.split("-")[0],
            unlock_type: unlockType.value,
            lock_name: lockId.split("-")[1]
          }
        ),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
          }
        }
      );

      // console.log(response?.data)
      if (response?.data?.status === "ok") {
        toast.success(`${response?.data?.message}`);
      } else {
        toast.error(`${response?.data?.message}`);
      }
      setEditLockBtnLoading(false);
      setEditLockModal(false);
      getAllResources();
      return response;
    } catch (err) {
      console.log(err);
      toast.error(`${err?.message}`);
    }
  }

  const removeLock = async () => {
    setRemoveLockBtnLoading(true);

    try {
      const response = await axios.delete(`${REMOVE_LOCK}${resourceId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
          }
        }
      );

      // console.log(response?.data)
      if (response?.data?.status === "ok") {
        toast.success(`${response?.data?.message}`);
      } else {
        toast.error(`${response?.data?.message}`);
      }
      setRemoveLockModal(false);
      setRemoveLockBtnLoading(false);
      getAllResources();
      return response;
    } catch (err) {
      console.log(err);
      toast.error(`${err?.message}`);
    }
  }

  useEffect(() => {
    getAllResources();
  }, [token])

  return (
    <>
      <Toaster />

      <Modal
        isOpen={assignLockModal}
      >
        <ModalBody>
          <label htmlFor="lock_name">Lock Name</label>
          <select className="form-select mt-3" aria-label="locks" placeholder="Select a lock to assign" onChange={(e) => setLockId(e.target.value)} defaultValue="">
            <option value="">Please select a lock to assign...</option>
            {allLocks?.map(lock => <option key={lock.smartlockId} value={`${lock.smartlockId}-${lock.name}`}>{lock.name}</option>)}
          </select>

          <label htmlFor="unlock_type" className="mt-3">Unlock Type</label>
          <select className="form-select mt-3" aria-label="locks" placeholder="Select the unlock type" onChange={(e) => setUnlockType1(e.target.value)} defaultValue="">
            <option value="">Please select the unlock type...</option>
            {unlockTypes?.map(type => <option key={type.value} value={type.value}>{type.name}</option>)}
          </select>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={assignLock}>{assignLockBtnLoading ? "Loading..." : "Assign Lock"}</button>
          <button className="btn btn-secondary" onClick={() => setAssignLockModal(false)}>Close</button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={editLockModal}
      >
        <ModalBody>
          <label htmlFor="lock_name">Lock Name</label>
          <select className="form-select mt-3" aria-label="locks" placeholder="Select a lock to assign" onChange={(e) => setLockId(e.target.value)} value={lockId}>
            <option value="">Please select a lock to assign...</option>
            {allLocks?.map(lock => <option key={lock.smartlockId} value={`${lock.smartlockId}-${lock.name}`}>{lock.name}</option>)}
          </select>

          <label htmlFor="unlock_type" className="mt-3">Unlock Type</label>
          <select className="form-select mt-3" aria-label="locks" placeholder="Select the unlock type" onChange={(e) => setUnlockType(...unlockTypes.filter(type => type.value === e.target.value))} value={unlockType.value}>
            <option value="">Please select the unlock type...</option>
            {unlockTypes?.map(type => <option key={type.value} value={type.value}>{type.name}</option>)}
          </select>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={editLock}>{editLockBtnLoading ? "Loading..." : "Edit Lock"}</button>
          <button className="btn btn-secondary" onClick={() => setEditLockModal(false)}>Close</button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={removeLockModal}
      >
        <ModalBody>
          <p>Are you sure you want to remove the lock?</p>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={removeLock}>{removeLockBtnLoading ? "Loading..." : "Remove Lock"}</button>
          <button className="btn btn-secondary" onClick={() => setRemoveLockModal(false)}>Close</button>
        </ModalFooter>
      </Modal>

      {/* <p>{token}</p> */}

      <div className="table-responsive m-3">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Address</th>
              <th scope="col">ZIP</th>
              <th scope="col">City</th>
              <th scope="col">Has Lock</th>
              <th scope="col">Lock Name</th>
              <th scope="col">Unlock Type</th>
              <th></th>
            </tr>
          </thead>

          {getResourcesLoading ? (
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  Loading items...
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {resources?.map(resource =>
                <tr key={resource?.resource_id}>
                  <td>
                    {resource.name}
                  </td>
                  <td>
                    {resource.type.name}
                  </td>
                  <td>
                    {resource.address}
                  </td>
                  <td>
                    {resource.postcode}
                  </td>
                  <td>
                    {resource.city}
                  </td>
                  <td>
                    {resource.has_lock?.toString() === "1" ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-x-circle text-danger"></i>}
                  </td>
                  <td>
                    {resource.lock_name}
                  </td>
                  <td>
                    {resource.unlock_type === "open" ? "Open" : resource.unlock_type === "unlatch" ? "Open + Unlatch" : ""}
                  </td>
                  <td>
                    <Dropdown isOpen={resource?.resource_id?.toString() === dropdownOpen.resource_id ? dropdownOpen.status : false} toggle={() => {
                      setDropdownOpen({ resource_id: `${resource?.resource_id}`, status: !dropdownOpen.status });
                      setResourceId(resource?.resource_id);
                    }}>
                      <DropdownToggle style={{ "backgroundColor": "transparent", "outline": "none", "border": "none", "margin": 0, "padding": 0 }}>
                        <i style={{ cursor: "pointer" }} className="bi bi-three-dots-vertical text-dark"></i>
                      </DropdownToggle>
                      <DropdownMenu>
                        {resource.has_lock?.toString() === "0" && (
                          <DropdownItem onClick={() => {
                            setAssignLockModal(true);
                            setUnlockType1("");
                            setLockId("");
                            getAllLocks();
                          }}>Assign Lock</DropdownItem>
                        )}
                        {resource.has_lock?.toString() === "1" && (
                          <>
                            <DropdownItem onClick={() => {
                              setEditLockModal(true);
                              getAllLocks();
                              setUnlockType(...unlockTypes.filter(type => type.value === resource?.unlock_type));
                              setLockId(`${resource?.lock_id}-${resource?.lock_name}`);
                            }}>Edit</DropdownItem>
                            <DropdownItem onClick={() => setRemoveLockModal(true)}>Remove Lock</DropdownItem>
                          </>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};

export default Table;
