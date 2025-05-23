import {useQuery} from '@tanstack/react-query'
import {getUser} from "../api/auth"

export const useAuth =()=>{
    const {data,isError,isLoading} =useQuery({
        queryKey:['user'],
        queryFn:getUser,
        retry:false,
        refetchOnWindowFocus:false
    })

    // console.log("los datos desde hook useAuth:",data)
    console.log(isError)


    return {data,isError,isLoading}
}