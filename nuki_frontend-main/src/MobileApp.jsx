import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from "react-router-dom";
import { GET_ALL_BOOKINGS } from "./constants/defaultValues";
import toast, { Toaster } from 'react-hot-toast';
import axios from './api/axios';
import Card from './components/Card';

const MobileApp = () => {
  const [startPoint, setStartPoint] = useState(0);
  const [pullChange, setPullChange] = useState();
  const refreshCont = useRef(0);
  let [searchParams, setSearchParams] = useSearchParams();

  //token
  const token = searchParams.get('token');

  //bookings
  const [bookings, setBookings] = useState([]);

  //loading
  const [getBookingsLoading, setGetBookingsLoading] = useState(false);

  const initLoading = () => {
    refreshCont.current.classList.add("loading");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const pullStart = (e) => {
    const { screenY } = e.targetTouches[0];
    setStartPoint(screenY);
  };

  const pull = (e) => {
    const touch = e.targetTouches[0];
    const { screenY } = touch;
    let pullLength = startPoint < screenY ? Math.abs(screenY - startPoint) : 0;
    setPullChange(pullLength);
    console.log({ screenY, startPoint, pullLength, pullChange });
  };

  const endPull = (e) => {
    setStartPoint(0);
    setPullChange(0);
    if (pullChange > 220) initLoading();
  };

  const getAllBookings = async () => {
    if (token === null) {
      return;
    }

    setGetBookingsLoading(true);

    try {
      const response = await axios.get(`${GET_ALL_BOOKINGS}${token}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${import.meta.env.VITE_AUTHORIZATION_TOKEN}`
          },
          withCredentials: true
        }
      );

      console.log(response?.data)
      setGetBookingsLoading(false);
      setBookings(response?.data);
      return response;
    } catch (err) {
      console.log(err);
      // toast.error(`${err?.message}`);
    }
  }

  useEffect(() => {
    getAllBookings();
  }, [token])

  useEffect(() => {
    window.addEventListener("touchstart", pullStart);
    window.addEventListener("touchmove", pull);
    window.addEventListener("touchend", endPull);
    return () => {
      window.removeEventListener("touchstart", pullStart);
      window.removeEventListener("touchmove", pull);
      window.removeEventListener("touchend", endPull);
    };
  });

  return (
    <>
      <Toaster />

      <div
        ref={refreshCont}
        className="refresh-container w-fit d-flex justify-content-center align-items-center"
        style={{ position: "absolute", top: pullChange / 5 || "-40px", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <div className="refresh-icon p-2 rounded-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            width="30px"
            height="30px"
            style={{ transform: `rotate(${pullChange}deg)` }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>
      </div>

      <div className='container min-h-screen' style={{ marginTop: pullChange / 2.5 || "0px" }}>
        {/* <div className='d-flex justify-content-end align-items-end mb-5 mt-3'>
      <i onClick={getAllBookings} className="fa-solid fa-arrows-rotate"></i>
      </div> */}
        <div style={{ textAlign: "center" }} className="mb-5">
          {/* <h5 className='mt-3'>Tus próximas reservas.</h5>
        <p>Solamente estás viendo tus próximas 4 reservas. Podrás desbloquear el resto más cerca de la fecha</p> */}
          <p className='mt-3 mb-3' style={{ backgroundColor: "#D3D4EA", padding: "15px", borderRadius: '15px', margin: "auto", textTransform: "uppercase", fontWeight: "bold" }}>Pulsa en el candado para desbloquear la puerta.</p>
          <p style={{ backgroundColor: "#3D2E47", padding: "15px", borderRadius: '15px', margin: "auto", textTransform: "uppercase", color: "#fff", fontWeight: "bold" }}>Estas viendo tus próximas 4 reservas. Podrás desbloquear el resto más cerca de la fecha.</p>
        </div>

        {getBookingsLoading ? (
          <div className='d-flex align-items-center justify-content-center w-100'>
            <div className="spinner-grow text-secondary m-3" role="status">
              <span className="visually-hidden">Loading.</span>
            </div>
            <div className="spinner-grow text-secondary m-3" role="status">
              <span className="visually-hidden">.</span>
            </div>
            <div className="spinner-grow text-secondary m-3" role="status">
              <span className="visually-hidden">.</span>
            </div>
          </div>
        ) : (
          <Card bookings={bookings} getAllBookings={getAllBookings} />
        )}
      </div>
    </>
  )
}

export default MobileApp