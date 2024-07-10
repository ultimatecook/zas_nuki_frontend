import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { OPEN_LOCK, CLOSE_LOCK, UNLATCH_LOCK } from "../constants/defaultValues";
import axios from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const Card = ({ bookings, getAllBookings }) => {
  const [lockId, setLockId] = useState(null);
  const [lockId1, setLockId1] = useState(null);
  const [showConfirmationScreen, setShowConfirmationScreen] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [finalScreen, setFinalScreen] = useState(false);

  const openLock = async () => {
    if (lockId === null || lockId === undefined) {
      return;
    }

    // console.log(lockId)

    // const toastId = toast.loading('Opening the lock...');
    setShowConfirmationScreen(false);
    setLoadingScreen(true);

    try {
      const response = await axios.post(`${UNLATCH_LOCK}${lockId}`,
        JSON.stringify({
          action: 3
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
          }
        }
      );

      console.log(response?.data)
      // toast.dismiss(toastId);

      const myFunc = () => {
        setShowConfirmationScreen(false);
        setLoadingScreen(false);
        setFinalScreen(true);
      }
      
      const myTimeout = setTimeout(myFunc, 10000);

      return response;
    } catch (err) {
      console.log(err);
      // toast.dismiss(toastId);
      // toast.error(`${err?.message}`);
    }
  }

  const closeLock = async () => {
    if (lockId1 === null || lockId1 === undefined) {
      return;
    }

    const toastId = toast.loading("Closing the lock...");

    const data = {};

    try {
      const response = await axios.post(`${CLOSE_LOCK}${lockId1}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
          }
        }
      );

      console.log(response?.data)
      toast.dismiss(toastId);
      if (response?.data?.status === "ok") {
        // toast.success(`${response?.data?.message}`);
      } else {
        // toast.error(`${response?.data?.message}`);
      }

      getAllBookings();
      return response;
    } catch (err) {
      console.log(err);
      toast.dismiss(toastId);
      // toast.error(`${err?.message}`);
    }
  }

  // useEffect(() => {
  //   openLock();
  // }, [lockId])

  useEffect(() => {
    closeLock();
  }, [lockId1])

  return (
    <>
      <Toaster />

      <hr className="hr" />

      {finalScreen ? (
        <div style={{ padding: "20px", backgroundColor: "#3D2E47", color: "#fff", borderRadius: '15px', textTransform: "uppercase" }}>
          <h1 style={{ fontWeight: "bold" }}>La puerta está abierta</h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "100px" }}>
            <button className="btn btn-success" onClick={() => {
              getAllBookings();
              setFinalScreen(false);
            }}>OK</button>
          </div>
        </div>
      ) : loadingScreen ? (
        <div style={{ padding: "20px", backgroundColor: "#3D2E47", color: "#fff", borderRadius: '15px', textTransform: "uppercase" }}>
          <h1 style={{ fontWeight: "bold" }}>La puerta se está desbloqueando</h1>
          <h1 style={{ fontWeight: "bold", marginTop: 150 }}>Por favor, ten paciencia</h1>
        </div>
      ) : finalCloseScreen ? (
        <div style={{ padding: "20px", backgroundColor: "#3D2E47", color: "#fff", borderRadius: '15px', textTransform: "uppercase" }}>
          <h1 style={{ fontWeight: "bold" }}>La puerta está cerrada</h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "100px" }}>
            <button className="btn btn-success" onClick={() => {
              getAllBookings();
              setFinalCloseScreen(false);
            }}>OK</button>
          </div>
        </div>
      ) : loadingCloseScreen ? (
        <div style={{ padding: "20px", backgroundColor: "#3D2E47", color: "#fff", borderRadius: '15px', textTransform: "uppercase" }}>
          <h1 style={{ fontWeight: "bold" }}>La puerta se está cerrando</h1>
          <h1 style={{ fontWeight: "bold", marginTop: 150 }}>Por favor, ten paciencia</h1>
        </div>
      ) : showConfirmationScreen ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "20px", backgroundColor: "#3D2E47", color: "#fff", borderRadius: '15px', textTransform: "uppercase" }}>
          <h1 style={{ fontWeight: "bold" }}>¿Estás seguro de que quieres desbloquear la puerta?</h1>
          <div className='mt-3 w-100' style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button className='btn btn-secondary' onClick={() => setShowConfirmationScreen(false)}>CANCELAR</button>
            <button className='btn btn-success' onClick={openLock}>CONFIRMAR</button>
          </div>
        </div>
      ) : (
        <>
          {bookings?.length === 0 && (
            <p className='text-danger' style={{ fontWeight: "bold" }}>No tienes ninguna reserva confirmada.</p>
          )}

          {bookings?.map(booking => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }} className="mb-5" key={booking.resource_id}>
              <div style={{ flex: 0.5, justifyContent: "center", display: "flex", alignItems: "center" }}>
                {booking.can_toggle?.toString() === "1" ? <i className="fa-solid fa-unlock bg-success" style={{ padding: "20px", borderRadius: "50%", color: "#f1f1f1" }} onClick={() => {
                  setLockId(booking.lock_id);
                  setShowConfirmationScreen(true);
                }}></i> : <i className="fa-solid fa-lock" style={{ padding: "20px", borderRadius: "50%", backgroundColor: "#f1f1f1" }} 
                onClick={() => setLockId1(booking.lock_id)}
                ></i>}
              </div>
              <div style={{ backgroundColor: "#3D2E47", padding: "20px", flex: 1, borderRadius: "20px", color: "#fff" }}>
                <p style={{ fontWeight: "bold" }}>{booking.resource_name}</p>
                <p>{moment(new Date(booking?.start_date?.split(",")[0]).toString()).format('DD MMMM YYYY')}</p>
                <p>{booking?.start_date?.split(",")[1].split(":")[0]}:{booking?.start_date?.split(",")[1].split(":")[1]} - {booking?.end_date?.split(",")[1].split(":")[0]}:{booking?.end_date?.split(",")[1].split(":")[1]}</p>
              </div>
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "20px" }}>
            <button className='btn btn-success' onClick={openLock}>Open Lock</button>
            <button className='btn btn-secondary' onClick={closeLock} style={{ marginLeft: '10px' }}>Close Lock</button>
          </div>
        </>
      )}
    </>
  );
};

export default Card;