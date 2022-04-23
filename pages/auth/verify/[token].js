import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/client'
import { toast } from 'react-toastify'
import ButtonLoader from '../../../components/layout/ButtonLoader'
import { clearErrors, verifyUser } from '../../../redux/actions/userActions'
import {useSelector,useDispatch} from 'react-redux'
import Layout from '../../../components/layout/Layout'

const Verify = () => {

    const { success,error } = useSelector((state) => state.userVerifyReducer);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const router = useRouter();
    console.log(router.query.token);

    const submitHandler = async (e) => {
       
        e.preventDefault();
        setLoading(true);
        dispatch(verifyUser(router.query.token)); 
        
    }

    useEffect(() => {
        if (success) {
            toast.success("Account Verified Successfully");
            router.push(`/login`);
        }
        if (error) {
            console.log(error);
            toast.error(error);
             setLoading(false);
        }
          dispatch(clearErrors());  
    },[success,dispatch,error]);


    return (
          <Layout title='User Verify'>
        <div className="container container-fluid">
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Verify Email</h1>
                        <button
                            id="login_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true : false}
                        >
                            {loading ? <ButtonLoader />: 'Verify'}
                        </button>
                    </form>
                </div>
            </div>
            </div>
            </Layout>
    )
}

export default Verify
