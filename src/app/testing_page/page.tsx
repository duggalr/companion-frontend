import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
// import useUserContext from '../../lib/hooks/useUserContext';


export default function TestingPage() {

    // // // TODO: create webhook
    // const userData = useContext(UserContext);
    // console.log('Data:', userData);

    // const { userData } = useUserContext();
    // console.log('user-data:', userData);

    const userData = useContext(UserContext);

    // console.log("user-context:", UserContext)

    return (

        <h1 className="text-2xl text-black">
            Testing Page
        </h1>

    )

};