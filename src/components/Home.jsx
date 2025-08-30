import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCopy, FaMoon, FaSun } from "react-icons/fa";
import { Audio, ThreeDots, ThreeCircles, ColorRing } from 'react-loader-spinner'
import { Bounce, Flip, Slide, ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

const Home = () => {
    let [apiURL, setapiURL] = useState("");
    let [apiURLJSON, setapiURLJSON] = useState({
        apiData: "",
        status: "---"
    });
    let [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")));
    let [checkapiURL, setcheckapiURL] = useState(false);
    let [apiURLJSONLoad, setapiURLJSONLoad] = useState(false);
    let [apiDataCopy, setapiDataCopy] = useState("Copy");

    let success_message = (message) =>{
        toast.success(message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Flip,
        });
    }

    let error_message = (message) =>{
        toast.error(message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Flip,
        });
    }
    
    let keydonwEvents = (e) =>{
        let keys = (e.key).toLowerCase();
        // console.log(keys);
        if(e.ctrlKey && keys === "h"){
            e.preventDefault();
            getAPIURLData(e);
        }
        // else if(e.ctrlKey && keys === "c"){
        //     e.preventDefault();
        //     copyAPIJSON();
        // }
    }

    useEffect(() =>{
        document.title = "API HUB";
        // console.log(JSON.parse(localStorage.getItem("darkMode")));
        window.addEventListener("keydown", keydonwEvents)
        return () =>{
            window.removeEventListener("keydown", keydonwEvents)
        }
    }, []);
    
    let apiEndPoint = (url) =>{
        setapiURL(url);
    }

    let getAPIURLData = async (e) =>{
        e.preventDefault();
        if(apiURL === ""){
            error_message("API Field required");
        }
        else{
            setapiURLJSONLoad(true);
            try{
                // let httpMethod = "get";
                let response = await axios({
                    url: apiURL,
                    method: "GET",
                });
                let data = JSON.stringify(response.data, null, 2);
                setapiURLJSONLoad(false);
                setapiURLJSON(prev => ({
                    apiData: data,
                    status: response.status
                }));
                setcheckapiURL(true);
                success_message("Successfull");
                // setTimeout(() =>{
                // }, 0);
            }
            catch(error){
                console.log(error);
                setapiURLJSON(prev => ({
                    apiData: "",
                    status: ""
                }));
                setapiURLJSONLoad(false);
                setcheckapiURL(false);
                error_message("Invalid API endpoint");
                setapiURLJSON("INVALID API ENDPOINT");
            }
        }
    }

    let copyAPIJSON = () =>{
        navigator.clipboard.writeText(apiURLJSON.apiData).then(() =>{
            setapiDataCopy("Copied");
            setTimeout(() =>{
                setapiDataCopy("Copy");
            }, 1000);
        }).catch(() =>{
            alert("Failed to copy");
        });
        // success_message("Copied successfully");
    }

    let toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", JSON.stringify(!darkMode));
    };

    return (
        <>
            <Tooltip id="copy-json-data" />
            <Tooltip id="toggle-theme" />
            <div className='container mx-auto mt-10 mb-5 flex justify-center flex-col items-center p-5 rounded-lg'>
                <form className="w-6/12 mx-auto shadow-lg" onSubmit={(e) => getAPIURLData(e)}>
                    <label htmlFor="api-endpoint" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input value={apiURL} onChange={(e) => apiEndPoint(e.target.value)} type="text" id="api-endpoint" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="API ENDPOINT" autoComplete='off' />
                        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                </form>
                <div className={`${localStorage.getItem("darkMode") === "true" ? "bg-black text-white" : "bg-white text-black"} w-6/12 shadow-lg mt-10 rounded-lg`}>
                    <div className='flex justify-between items-center border-b pt-2 pb-2 pl-5 pr-5 shadow-sm'>
                        <h1 className='text-md font-sans font-bold'>STATUS: {apiURLJSON.status}</h1>
                        {/* <h1 className='text-md font-sans font-bold'>{apiURLJSON.status}</h1> */}
                        <div className='flex justify-between items-center gap-3'>
                            <button data-tooltip-id="toggle-theme" data-tooltip-content={localStorage.getItem("darkMode") === "true" ? "Light Mode" : "Dark Mode"} onClick={() => toggleDarkMode()} type="button" className={`${apiURLJSON.apiData.length === 0 ? "pointer-events-none opacity-50" : ""} w-10 h-10 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-md text-lg text-center flex justify-center items-center`}>{localStorage.getItem("darkMode") === "true" ? <FaSun/> : <FaMoon/>}</button>
                            <button data-tooltip-id="copy-json-data" data-tooltip-content={apiDataCopy} onClick={() => copyAPIJSON()} type="button" className={`${apiURLJSON.apiData.length === 0 ? "pointer-events-none opacity-50" : ""} w-10 h-10 text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-md text-lg text-center flex justify-center items-center`}><FaCopy/></button>
                        </div>
                    </div>
                    {
                        apiURLJSONLoad ? 
                        <div className='flex justify-center items-center p-5'>
                            <ColorRing width={80} height={80}/>
                        </div> : 
                        (apiURLJSON.apiData.length > 0 ? 
                        <pre className={`h-96 overflow-y-scroll font-mono font- break-words whitespace-pre-wrap block p-5`}>
                            {apiURLJSON.apiData}
                            {/* {
                                !checkapiURL ? <h2 className="text-2xl text-center font-bold dark:text-white p-5">INVALID API ENDPOINT</h2> : null
                            } */}
                        </pre> : 
                        <h2 className="text-lg text-center font-bold dark:text-white p-5">PLEASE ENTER API ENDPOINT</h2>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Home