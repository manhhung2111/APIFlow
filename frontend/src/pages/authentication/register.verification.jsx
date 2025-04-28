import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import UserService from "@services/user";
import {toast} from "react-toastify";
import PageLoader from "@components/app/utils/page.loader";

export default function RegisterVerificationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        if (code && code.length > 0) {
            async function onVerify(code) {
                const response = await UserService.verifyEmail(code);

                if (response.code === 0){
                    toast.success(response.message);
                    navigate("/login")
                } else {
                    toast.error(response.message);
                }
                setVerifying(false);
            }

            onVerify(code).then(() => {console.log("Ok");
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    return <div className="register-verification-page">
        <h3>Verification</h3>
        {verifying && <p>Your account is verifying...</p>}
        {!verifying && <p>Finish verifying</p>}
    </div>
}