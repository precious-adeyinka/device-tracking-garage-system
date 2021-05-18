import React, { useRef, useState, useEffect } from 'react';

// Hero Icons
import { SearchIcon, FilterIcon, DeviceMobileIcon } from '@heroicons/react/outline';
import { XIcon, ViewGridIcon, ViewListIcon, TrashIcon, PlusCircleIcon, ChatAltIcon, OfficeBuildingIcon} from '@heroicons/react/solid';

// Loader
import RiseLoader from "react-spinners/RiseLoader";

// Frirebase
import { database } from '../firebase';

// Toast
import { useToasts } from 'react-toast-notifications';

// components
// import ConnectivityListener from '../components/ConnectivityListener';
import Device from './Device';

const Grid = () => {
  //Toasts
  const { addToast } = useToasts()

  // Refs
  const searchInputRef = useRef(null);
  const deviceRef = useRef(null);

  // State Vars
  const [isDeviceFormVisible, setDeviceFormVisibility] = useState(false);
  const [garage, setGarage] = useState(null);
  const [garageBackup, setGarageBackup] = useState(null);
  const [blocking, setBlocking] = useState(false);
  

  // Device State
  const [deviceName, setDeviceName] = useState('');
  const [deviceOs, setDeviceOs] = useState('');
  const [deviceManufacturer, setDeviceManufacturer] = useState('');
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDeviceForm = () => {
    setDeviceFormVisibility(!isDeviceFormVisible);
  }

  useEffect(async () => {
    // Init
    init();
  }, []);

  const init = () => {
    let allData = [];

    /*
    ** Persis Data in Web Storage
    */
    if(window.localStorage.getItem('garageDeviceData')) {
      let deviceData = JSON.parse(window.localStorage.getItem('garageDeviceData')).data;
      if (deviceData !== []) {
        setGarage(deviceData);
        setGarageBackup(deviceData);
      }
      else {
        setGarage(null);
        setGarageBackup(null);
      }
    }
    else {
      // Access data from firestore cloud db
      database.collection('devices').orderBy('device').onSnapshot( querySnapshot => {
        const changes = querySnapshot.docChanges();
        
        let data = {};
        // Iterate the documents in the collection
        changes.forEach((change, i, arr) => {
          if (change.type === 'added') {
            data[change.doc.id] = change.doc.data();
          } else if (change.type === 'modified') {
            // data[change.doc.id] = change.doc.data();
            // console.log({data: change.doc.data()});
          } else if (change.type === 'removed') {
            //  data[change.doc.id] = change.doc.data();
            //  console.log({data: change.doc.data()});
          }
          // data[change.doc.id] = change.doc.data();
        })

        for (let item in data) {
          allData.push({id: item, ...data[item]});
        }

        const tempData = {
          total: allData.length,
          data: [...allData],
          filteredData: [...allData]
        };
        
        // Persist Data on Web Storage
        window.localStorage.setItem('garageDeviceData', JSON.stringify(tempData));

        setGarage([...allData]);
        setGarageBackup([...allData]);
      });
    }
  }

  const updateSearch = e => {
    setSearchTerm(e.target.value);
  }

  const handleSearch = () => {
    setGarage(null);
    const newGarage = garageBackup.filter(item => item.device.toLowerCase().indexOf(searchTerm.trim().toLowerCase()) > -1);
    setGarage(newGarage);
  }

  const handleBlur = () => {
    if (searchTerm === "" || searchTerm.length === 0) {
      setGarage(garageBackup);
    }
  }

  // Toogle UI BLock
  const toggleBlocking = (status) => {
    setBlocking(status);
  }

  /**
   * DEVICE Handlers
   */
  const updateDeviceName = e => {
    setDeviceName(e.target.value);
  }
  const updateDeviceOs = e => {
    setDeviceOs(e.target.value);
  }
  const updateDeviceManufacturer = e => {
    setDeviceManufacturer(e.target.value);
  }

  // Add New Device
  const addNewDevice = (e) => {
    e.preventDefault();

    let garageData = JSON.parse(window.localStorage.getItem('garageDeviceData'));
    if (garageData.total === 10) {
      addToast("You have used up your storage!", {
        appearance: 'warning',
        autoDismiss: true,
      });
      return;
    }
    else {
      // Block UI
      toggleBlocking(true);

      let newDeviceObject = {
        "device": deviceName,
        "isCheckedOut": false,
        "lastCheckOutDate": "",
        "lastCheckOutBy": "",
        "manufacturer": deviceManufacturer,
        "os": deviceOs
      };

      database.collection("devices").add(newDeviceObject)
      .then((docRef) => {
          // console.log("Document written with ID: ", docRef.id);
          // Close Form
          setDeviceName('');
          setDeviceOs('');
          setDeviceManufacturer('');
          setDeviceFormVisibility(false);
          addToast("Success", {
            appearance: 'success',
            autoDismiss: true,
          });
          // TODO - Add Toast
          // Block UI
          toggleBlocking(false);

          // Access data from firestore cloud db
          const allData = [];

          database.collection('devices').orderBy('device').onSnapshot( querySnapshot => {
            const changes = querySnapshot.docChanges();
            
            let data = {};
            // Iterate the documents in the collection
            changes.forEach((change, i, arr) => {
              if (change.type === 'added') {
                data[change.doc.id] = change.doc.data();
              } else if (change.type === 'modified') {
                // data[change.doc.id] = change.doc.data();
                // console.log({data: change.doc.data()});
              } else if (change.type === 'removed') {
                //  data[change.doc.id] = change.doc.data();
                //  console.log({data: change.doc.data()});
              }
              // data[change.doc.id] = change.doc.data();
            })

            for (let item in data) {
              allData.push({id: item, ...data[item]});
            }

            const tempData = {
              total: allData.length,
              data: [...allData],
              filteredData: [...allData]
            };
            
            // Persist Data on Web Storage
            window.localStorage.setItem('garageDeviceData', JSON.stringify(tempData));

            // Call Init - Update App
            init();
          });
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
    }
  }

  return (
    <div className="w-full h-auto p-4 bg-blue-50">
      <div className="h-auto bg-white w-full rounded-md mx-auto p-3 pl-2 border-b border-gray-100 sticky top-0 z-10 md:flex md:justify-between md:items-center md:space-x-40">
        <div className="w-full flex flex-grow items-center space-x-4">
          <form className="flex items-center flex-grow relative">
            <SearchIcon className="h-5 text-sm text-gray-300 absolute left-3" />
            <input 
            ref={searchInputRef} 
            className="flex-grow text-sm text-gray-700 rounded-md p-2 pl-9 border border-gray-200 focus:outline-none" 
            type="text" 
            placeholder="Search Garage..."
            value={searchTerm}
            onChange={updateSearch}
            onKeyUp={handleSearch}    
            onBlur={handleBlur}          
            />
            <XIcon onClick={() => searchInputRef.current.value = "" } 
            className="h-5 text-sm text-gray-500 absolute right-3 cursor-pointer transition duration-150 transform hover:scale-110 d-none" /> 
          </form>
          <button className="flex items-center px-3 py-2 rounded-md text-sm text-gray-500 cursor-pointer border border-gray-200 focus:outline-none">
            <FilterIcon className="h-4 text-sm text-gray-300 mr-2" /> Condition
          </button>
        </div>
        {/* Layout */}
        <div className="w-full flex flex-grow md:justify-end items-center my-3 space-x-4">
          <div className="flex items-center group">
            <ViewListIcon className="h-10 text-sm text-gray-700 bg-gray-100 p-1 cursor-pointer" />
            <ViewGridIcon className="h-10 text-sm text-gray-300 bg-white p-1 border border-gray-200 cursor-pointer" />
          </div>
          <button 
          className="flex items-center bg-blue-500 text-white text-sm py-2 px-3 rounded-md box-border focus:outline-none shadow-lg hover:shadow-sm"
          onClick={toggleDeviceForm}
          >
          <PlusCircleIcon className="h-5 mr-1" /> Add Device</button>
        </div>
        {/* Add Device Form */}
        {
          isDeviceFormVisible ? (
            <div className="h-screen w-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.80)] md:bg-[rgba(0,0,0,0.50)] z-50 flex justify-center items-center md:-left-40">
              <div className="bg-white rounded-lg h-96 w-11/12 transition duration-1000 relative opacity-80 active:opacity-100 
              focus-within:opacity-100 md:max-w-sm">
                {/* Close Button */}
                <XIcon className="h-5 absolute top-4 right-4 text-xl text-gray-700 cursor-pointer" onClick={toggleDeviceForm} />
                {/* Header */}
                <div className="text-center m-3 mt-10 font-san">
                  <b className="text-xl text-gray-900">Add A New Device</b> <br />
                  <span className="text-sm text-gray-400">Fill in device details below and click to add device</span>
                </div>

                {/* Device Form */}
                <form className="w-11/12 mx-auto flex flex-col justify-center items-center my-10 relative" onSubmit={addNewDevice}>
                  {/* Blocking Ui */}
                  {
                    blocking ? (
                      <div className="bg-[rgba(255,255,255,0.7)] flex items-center justify-center h-full w-full overflow-hidden fixed top-0 left-0 bottom-0 right-0 z-50">
                        <RiseLoader color={'#3b82f6'} size={10} />
                      </div>
                    ) : null
                  }

                  {/* Device Name */}
                  <div className="flex w-11/12 relative overflow-hidden items-center my-2">
                    <DeviceMobileIcon className="h-5 absolute top-2 left-2 text-sm text-gray-300" />
                    <input 
                    className="border border-gray-200 p-2 rounded-md flex-grow pl-10 text-sm font-sans text-gray-500 font-light focus:outline-none" 
                    type="text" 
                    placeholder="Device Name" 
                    autoFocus={true}
                    value={deviceName}
                    onChange={updateDeviceName}
                    />
                  </div>
                   {/* Device Os */}
                   <div className="flex w-11/12 relative overflow-hidden items-center my-2">
                    <DeviceMobileIcon className="h-5 absolute top-2 left-2 text-sm text-gray-300" />
                    <input 
                    className="border border-gray-200 p-2 rounded-md flex-grow pl-10 text-sm font-sans text-gray-500 font-light focus:outline-none" 
                    type="text" 
                    placeholder="Device Os" 
                    value={deviceOs}
                    onChange={updateDeviceOs}
                    />
                  </div>
                  {/* Device Manufacturer */}
                  <div className="flex w-11/12 relative overflow-hidden items-center my-2">
                    <OfficeBuildingIcon className="h-5 absolute top-2 left-2 text-sm text-gray-300" />
                    <input 
                    className="border border-gray-200 p-2 rounded-md flex-grow pl-10 text-sm font-sans text-gray-500 font-light focus:outline-none" 
                    type="text" 
                    placeholder="Device Manufacturer" 
                    value={deviceManufacturer}
                    onChange={updateDeviceManufacturer}
                    />
                  </div>

                  {/* Submit */}
                  <button type="submit" className="my-3 bg-blue-500 focus:outline-none text-white p-3 w-11/12 rounded-md shadow-xl hover:shadow-none">Add new device</button>
                </form>
              </div>
            </div>
          ) : null
        }
      </div>
      {/* Gallery */}
      <div className="h-auto p-3 py-5 bg-white my-0 w-full rounded-b- sm:grid sm:grid-cols-2 sm:gap-4 md:grid md:grid-cols-3 md:gap-4">
        { garage && garage.length === 0 || garage === [] ? (<div className="animate-spin bg-white h-10 w-10 rounded-full mx-auto my-10 spinner"></div>) : null}
        {
          garage && garage.map(device => {
            return (
              <Device cb={init} device={device} key={device.id} />
            )
          })
        }
      </div>
      {/* Online / Offline */}
      {/* <ConnectivityListener /> */}
    </div>
  )
}

export default Grid;