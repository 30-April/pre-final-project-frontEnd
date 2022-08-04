import VerifyingPage from "../../../components/VerifyingPage"
import { useRouter } from 'next/router'

const userVerify = () =>{
    const router = useRouter()

    const { vertoken } = router.query

    return (
        <>
            <VerifyingPage token={vertoken} />
        </>
    )
}

export default userVerify