import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { MDBDataTable } from 'mdbreact'
import easyinvoice from 'easyinvoice'

import Loader from '../layout/Loader'

import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';

import { getAdminBookings, deleteBooking, clearErrors } from '../../redux/actions/bookingActions'
import { DELETE_BOOKING_RESET } from '../../redux/constants/bookingConstants'

const AllBookings = () => {

    const dispatch = useDispatch()
    const router = useRouter()

    const { bookings, error, loading } = useSelector(state => state.bookings)
    const { isDeleted, error: deleteError } = useSelector(state => state.booking)

    useEffect(() => {

        dispatch(getAdminBookings())

        if (error) {
            toast.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {
            toast.error(deleteError);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            router.push('/admin/bookings')
            dispatch({ type: DELETE_BOOKING_RESET })
        }


    }, [dispatch, deleteError, isDeleted])


    const setBookings = () => {
        const data = {
            columns: [
                {
                    label: 'Booking ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Check In',
                    field: 'checkIn',
                    sort: 'asc'
                },
                {
                    label: 'Check Out',
                    field: 'checkOut',
                    sort: 'asc'
                },
                {
                    label: 'Amount Paid',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }

            ],
            rows: []
        }

        bookings && bookings.forEach(booking => {
            data.rows.push({
                id: booking._id,
                checkIn: new Date(booking.checkInDate).toLocaleString('en-US'),
                checkOut: new Date(booking.checkOutDate).toLocaleString('en-US'),
                amount: `₹${booking.amountPaid}`,
                actions:
                    <>
                        <Link href={`/admin/bookings/${booking._id}`}>
                            <a className="btn btn-primary">
                                <i className="fa fa-eye"></i>
                            </a>
                        </Link>

                        {/* <button className="btn btn-success mx-2" onClick={() => downloadInvoice(booking)}>
                            <i className="fa fa-download"></i>
                        </button> */}

                        <button className="btn btn-danger mx-2" onClick={() => deleteBookingHandler(booking._id)}>
                            <i className="fa fa-trash"></i>
                        </button>

                    </>
            })
        })

        return data;

    }

    const deleteBookingHandler = (id) => {
        dispatch(deleteBooking(id))
    }

    const downloadInvoice = async (booking) => {

   const data = {
            "documentTitle": "Room Booking INVOICE",
            "currency": "inr",
            "taxNotation": "gst", 
            "marginTop": 25,
            "marginRight": 25,
            "marginLeft": 25,
            "marginBottom": 25,
            "sender": {
                "company": "BookRoom",
                "address": "PDPU Road,Raysan",
                "zip": "382007",
                "city": "Gandhinagar",
                "country": "India"
            },
            "client": {
                "company": `${booking.user.name}`,
                "address": `${booking.user.email}`,
                "zip": "",
                "city": `Check In: ${new Date(booking.checkInDate).toLocaleString()}`,
                "country": `Check In: ${new Date(booking.checkOutDate).toLocaleString()}`
            },
            "invoiceNumber": `${booking._id}`,
            "invoiceDate": `${new Date(Date.now()).toLocaleString()}`,
            "products": [
                {
                    "quantity": `${booking.daysOfStay}`,
                    "description": `${booking.room.name}`,
                    "tax": 0,
                    "price": booking.room.pricePerNight
                }
            ],
            "bottomNotice": "This is auto generated Invoice of your booking on Book Room."
   };
        const result = await easyinvoice.createInvoice(data);
        console.log(result);
        easyinvoice.render(`invoice_${booking._id}.pdf`, result.pdf);
    }


    return (
        <div className='container container-fluid'>
            {loading ? <Loader /> :
                <>
                    <h1 className='my-5'>{`${bookings && bookings.length} Bookings`}</h1>

                    <MDBDataTable
                        data={setBookings()}
                        className='px-3'
                        bordered
                        striped
                        hover
                        noBottomColumns={true} 
                    />
                </>
            }

        </div>
    )
}

export default AllBookings
