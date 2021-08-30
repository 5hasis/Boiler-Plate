//import { response } from 'express'
import React from 'react'
import { useEffect } from 'react'
import axios from 'axios';

function LandingPage() {

    useEffect(() => {
        axios.get('/api/hello') //get request를 server에 보냄
        .then(response => {console.log(response)}) //server에서 돌아오는 response를 console에 띄움
    }, [])

    return (
        <div>
            LandingPage
        </div>
    )
}

export default LandingPage
