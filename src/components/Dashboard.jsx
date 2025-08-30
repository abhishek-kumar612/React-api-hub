import React, { useEffect } from 'react'

const Dashboard = () => {
    useEffect(() =>{
        document.title = "DASHBOARD";
    }, []);

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard