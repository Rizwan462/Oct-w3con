import React, { useState } from 'react'
import { Pincode_API } from './Constants';


const Home = () => {
    const [pincode, setPincode] = useState('');
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState('')



    const fetchPincodeData = async () => {
        if (pincode.length !== 6 || isNaN(pincode)) {
            setError('Please Enter a Valid 6-Digit pincode.')
            return
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const result = await response.json();

            console.log(result)

            if (result[0].Status === 'Error') {
                setError('Invalid pincode entered.');
                setData([]);
                setFilteredData([]);
            } else {
                setData(result[0].PostOffice || []);
                setFilteredData(result[0].PostOffice || []);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setData([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePincodeChange = (e) => {
        setPincode(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        const filtered = data.filter((postOffice) =>
            postOffice.Name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredData(filtered);

        if (filtered.length === 0 && e.target.value) {
            setError("Couldn't find the postal data you're looking for...");
        } else {
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchPincodeData();
    };



    return (
        <div className="flex flex-col items-center p-6 w-[80%] mx-auto bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold text-black mb-6">Enter Pincode</h1>
            
            

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="w-full flex-col mb-4">
                <input
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    value={pincode}
                    onChange={handlePincodeChange}
                    className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-black mb-3"
                />
                <button
                    type="submit"
                    className="bg-black text-white px-16 py-2 rounded-lg hover:bg-green-800 transition-colors duration-200"
                >
                    Lookup
                </button>
            </form>

            {/* Filter Input */}
            <input
                type="text"
                placeholder="🔍 Filter by post office name"
                value={filter}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Loader */}
            {loading && (
                <div className="loader my-4 border-4 border-blue-500 border-solid border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 my-4">{error}</p>}

            {/* Data Display */}
            
            {!loading && filteredData.length > 0 && (
                
                

                <div className="w-full m-auto grid grid-cols-2 mt-4">
                    
                    {filteredData.map((postOffice) => (
                        <div
                            key={postOffice.Name}
                            className="p-4 border mx-5 h-[200px] min-w-fit m-4 flex flex-col justify-between flex-wrap border-black rounded-md shadow-sm text-left"
                        >
                            <h2 className="text-lg font-semibold text-black">Name: {postOffice.Name}</h2>
                            <p className="text-gray-700">Branch Type: {postOffice.BranchType}</p>
                            <p className="text-gray-700">Delivery Status: {postOffice.DeliveryStatus}</p>
                           
                            <p className="text-gray-700">District: {postOffice.District}</p>
                            <p className="text-gray-700">Division: {postOffice.Division}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>



    )
}

export default Home