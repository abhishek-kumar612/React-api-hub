import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCopy, FaMoon, FaSun } from "react-icons/fa";
import { ColorRing } from 'react-loader-spinner'
import { Flip, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

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

    let success_message = (message) => {
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

    let error_message = (message) => {
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

    // let keydonwEvents = (e) => {
    //     let keys = (e.key).toLowerCase();
    //     // console.log(keys);
    //     if (e.ctrlKey && keys === "h") {
    //         e.preventDefault();
    //         getAPIURLData(e);
    //     }
    //     // else if(e.ctrlKey && keys === "c"){
    //     //     e.preventDefault();
    //     //     copyAPIJSON();
    //     // }
    // }

    useEffect(() => {
        document.title = "API HUB";
        // console.log(JSON.parse(localStorage.getItem("darkMode")));
        // window.addEventListener("keydown", keydonwEvents)
        // return () => {
        //     window.removeEventListener("keydown", keydonwEvents)
        // }
    }, []);

    let apiEndPoint = (url) => {
        setapiURL(url);
    }

    let getAPIURLData = async (e) => {
        e.preventDefault();
        if (apiURL.trim() === "") {
            error_message("API Field required");
        }
        else if (!apiURL.startsWith("https://")) {
            error_message("URL must contain https");
        }
        else {
            setapiURLJSONLoad(true);
            try {
                const response = await axios({
                    url: apiURL,
                    method: "GET",
                });

                setapiURLJSONLoad(false);
                setapiURLJSON({
                    apiData: response.data,
                    status: response.status
                });
                setcheckapiURL(true);
                success_message("Successful");
            } catch (error) {
                console.log(error);

                setapiURLJSONLoad(false);
                setapiURLJSON({
                    apiData: error.response?.data || { message: error.message },
                    status: error.response?.status || ""
                });
                setcheckapiURL(false);
                error_message("Invalid API endpoint");
            }

        }
    }

    let copyAPIJSON = () => {
        navigator.clipboard.writeText(JSON.stringify(apiURLJSON.apiData, null, 2)).then(() => {
            setapiDataCopy("Copied");
            setTimeout(() => {
                setapiDataCopy("Copy");
            }, 1000);
        }).catch(() => {
            alert("Failed to copy");
        });
    }

    let toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", JSON.stringify(!darkMode));
    };

    function hasRenderableJson(data) {
        if (!data) return false;
        if (Array.isArray(data)) return data.length > 0; // non-empty array
        if (typeof data === 'object') return true;      // allow single object, including error
        return false;
    }


    return (
        <>
            <Tooltip id="copy-json-data" />
            <Tooltip id="toggle-theme" />
            <ToastContainer />
            <h1 className='text-3xl font-cursive tracking-widest underline font-bold text-center my-10'>API HUB</h1>
            <div className='container mx-auto mt-10 mb-5 flex justify-center flex-col items-center p-5 rounded-lg'>
                <form className="w-6/12 mx-auto shadow-lg" onSubmit={(e) => getAPIURLData(e)}>
                    <label htmlFor="api-endpoint" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input value={apiURL} onChange={(e) => apiEndPoint(e.target.value)} type="text" id="api-endpoint" className="block w-full p-4 ps-10 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="API ENDPOINT" autoComplete='off' />
                        <div className='absolute end-2.5 bottom-2.5 flex justify-center items-center gap-2'>
                            <button type="submit" className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">Run</button>
                            <button onClick={() => setapiURL("https://jsonplaceholder.typicode.com/users")} type="submit" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Sample</button>
                        </div>
                    </div>
                </form>
                <div className={`${localStorage.getItem("darkMode") === "true" ? "bg-black text-white" : "bg-white text-black"} w-6/12 shadow-lg mt-10 rounded-lg`}>
                    <div className='flex justify-between items-center border-b pt-2 pb-2 pl-5 pr-5 shadow-sm'>
                        <h1 className='text-md font-sans font-bold'>STATUS: {apiURLJSON.status}</h1>
                        {/* <h1 className='text-md font-sans font-bold'>{apiURLJSON.status}</h1> */}
                        <div className='flex justify-between items-center gap-3'>
                            {/* <button data-tooltip-id="toggle-theme" data-tooltip-content={localStorage.getItem("darkMode") === "true" ? "Light Mode" : "Dark Mode"} onClick={() => toggleDarkMode()} type="button" className={`${apiURLJSON.apiData.length === 0 ? "pointer-events-none opacity-50" : ""} w-10 h-10 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-md text-lg text-center flex justify-center items-center`}>{localStorage.getItem("darkMode") === "true" ? <FaSun /> : <FaMoon />}</button> */}
                            <button data-tooltip-id="copy-json-data" data-tooltip-content={apiDataCopy} onClick={() => copyAPIJSON()} type="button" className={`${!hasRenderableJson(apiURLJSON.apiData) ? "pointer-events-none opacity-50" : ""} w-10 h-10 text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-md text-lg text-center flex justify-center items-center`}><FaCopy /></button>
                        </div>
                    </div>
                    {apiURLJSONLoad ? (
                        <div className='flex justify-center items-center p-5'>
                            <ColorRing width={80} height={80} />
                        </div>
                    ) : hasRenderableJson(apiURLJSON.apiData) ? (
                        <div className='overflow-auto max-h-96 rounded'>
                            <JSONPretty
                                style={{ padding: '1rem', backgroundColor: '#272822', borderRadius: '6px' }}
                                data={apiURLJSON.apiData}
                            />
                        </div>
                    ) : (
                        <h2 className="text-lg text-center font-bold dark:text-white p-5">
                            PLEASE ENTER API ENDPOINT
                        </h2>
                    )}

                </div>
            </div>
        </>
    )
}

export default Home