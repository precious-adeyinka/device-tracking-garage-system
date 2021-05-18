import React, { useState, useRef } from 'react';

// Hero Icons
import { SearchIcon, FilterIcon, DeviceMobileIcon, ShieldCheckIcon, BadgeCheckIcon } from '@heroicons/react/outline';
import { XIcon, ViewGridIcon, ViewListIcon, TrashIcon, PlusCircleIcon, ChatAltIcon, OfficeBuildingIcon} from '@heroicons/react/solid';

// Loader
import RiseLoader from "react-spinners/RiseLoader";

// Frirebase
import { database } from '../firebase';

// Toast
import { useToasts } from 'react-toast-notifications';

const Device = ({ cb, device }) => {
  //Toasts
  const { addToast } = useToasts()

   // Refs
   const deviceRef = useRef(null);

  // State
  const [deviceBlocking, setDeviceBlocking] = useState(false);
  const [blocking, setBlocking] = useState(false);

  // Toogle UI BLock
  const toggleDeviceBlocking = (status) => {
    if (deviceBlocking === false) {
      toggleBlocking(false);
    }

    if (deviceRef.current) {
      setDeviceBlocking(status);
    }
    else {
      setDeviceBlocking(false);
    }
  }

   // Toogle UI BLock
   const toggleBlocking = (status) => {
    setBlocking(status);
  }

  // Remove Device
  const removeDevice = (device) => {
    // Block UI
    toggleBlocking(true);

    database.collection("devices").doc(device).delete()
    .then(() => {
        addToast("Success", {
          // appearance: 'sucess'
          // autoDismiss: true,
        });
        console.log('Sucess!');
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
          cb();
        });
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
  }

   // Remove Device
  const updateDevice = (device, status) => {
    // Block UI
    // toggleBlocking(true);
    let currentUserDeviceCount = JSON.parse(window.localStorage.getItem('currentGarageUser')).deviceCheckedOutCount;
    // get current Hour
    let currentHour = new Date().getHours();

    if (device.isCheckedOut === status) {
      addToast("You're not allowed to do that!", {
        appearance: 'warning',
        autoDismiss: true,
      });
      return;
    }
    else if (currentUserDeviceCount === 1) {
      addToast("Only one check per user!", {
        appearance: 'warning',
        autoDismiss: true,
      });
      return;
    }
    else if (!(currentHour >= 9 && currentHour <= 17)) {
      addToast("Checkout can only be done between 9:00 am - 17:00pm", {
        appearance: 'info',
        autoDismiss: true,
      });
      return;
    }
    else {
      let copy = Object.assign({}, device);
      // update the currrent restaurant with the new data
      // let status = !copy.isCheckedOut;
      let lastCheckoutUser = JSON.parse(window.localStorage.getItem('currentGarageUser')).email;
      let lastCheckoutDate = new Date().toISOString();
      let updatedDeviceObject = {...copy, isCheckedOut: status, lastCheckOutBy: lastCheckoutUser, lastCheckOutDate: lastCheckoutDate};
      console.log(updatedDeviceObject);
      // send the updated data to the firebase backend
      database.collection("devices").doc(device.id).set(updatedDeviceObject)
      .then((updatedObject) => {
          // console.log('success!');
          let toastContent = status ? "Device Checkedin!" : "Device Checkedout!";
          addToast(toastContent, {
            appearance: 'success',
            autoDismiss: true,
          });
          return;
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
            cb();
          });

          // Update User Device Count
          let currentUser = JSON.parse(window.localStorage.getItem('currentGarageUser'));
          let newUserDeviceCount = {...currentUser, deviceCheckedOutCount: currentUser.deviceCheckedOutCount + 1};
          // Updat the User Object
          window.localStorage.setItem('currentGarageUser', JSON.stringify(newUserDeviceCount));

      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
    }
  }

  return (
    <div className="shadow-2xl max-h-72 w-full rounded-lg bg-white overflow-hidden my-5 grid grid-cols-2 auto-cols-auto relative" ref={deviceRef}>
      {
        deviceBlocking ? (
          <div className="bg-[rgba(255,255,255,0.7)] flex flex-col items-center justify-center h-full w-full overflow-hidden absolute top-0 left-0 bottom-0 right-0 z-50">
            {
             blocking ? ( <RiseLoader color={'#3b82f6'} size={10} />) : null 
            }
            <div className="w-6/12 flex justify-between my-10 space-x-4">
              <button className="bg-red-500 text-sm text-white text-center rounded-lg shadow-lg px-5 py-2 cursor-pointer focus:outline-none 
              transition duration-500 transform hover:scale-90" onClick={() => removeDevice(device.id)}>Remove</button>
              <button className="bg-green-500 text-sm text-white text-center rounded-lg shadow-lg px-5 py-2 cursor-pointer focus:outline-none 
              transition duration-500 transform hover:scale-90" onClick={() => toggleDeviceBlocking(false)}>Cancel</button>
            </div>
          </div>
        ) : null
      }

      {/* Left */}
      <div className="min-h-full bg-gray-100 flex items-center justify-center relative">
        <div className="h-40 w-40 rounded-full bg-white overflow-hidden flex items-center justify-center">
          <img className="object-cover bg-cover h-full w-full bg-center bg-no-repeat" src="device-2.jpg" alt="" />
        </div>
        {/* Icon */}
      <div className="flex h-10 w-10 rounded-full absolute top-2 left-2 cursor-pointer">
        <div className="animate-ping inline-flex rounded-full h-9 w-9 absolute bg-blue-500 opacity-75"></div>
        <ChatAltIcon className="h-8 cursor-pointer transition duration-100 hover:scale-125 text-white bg-blue-500 p-2 rounded-full" />
      </div>
      </div>

      {/* Right */}
      <div className="p-3 relative">
        <h2 className="text-md font-medium text-gray-700 truncate max-w-sm">{device.device}</h2>
        <h4 className="text-sm font-normal text-gray-300">{device.manufacturer}</h4>
        <h4 className="text-sm font-light text-gray-800 my-4 w-full">lorem ipsum donor et elar wahtever lain excrum diou un atum secta et er alem.</h4>
        {/* Trash Icon */}
        <button className="flex items-center justify-center text-sm text-gray-300 
        hover:text-red-700 absolute top-2 right-1 hover:rounded-full hover:bg-red-100 p-2 pr-1 focus:outline-none transition duration-100 text-center">
          <TrashIcon className="h-4 mr-1" onClick={() => toggleDeviceBlocking(true)} />
        </button>
        {/* Checkings */}
        <div className="flex flex-col space-y-3 items-center justify-between my-5 w-full max-w-full">
          <button className="w-full bg-green-100 text-green-700 text-sm font-sans font-normal py-2 px-3 rounded-md box-border 
          focus:outline-none active:bg-green-700 active:text-white shadow-lg hover:shadow-none hover:bg-green-700 hover:text-white relative flex justify-center items-center"
          onClick={() => updateDevice(device, true)}
          >
            {device.isCheckedOut ? <ShieldCheckIcon className="h-5 absolute left-5 mr-3" /> : null}
            <span>check-in</span>
          </button>
          <button className="w-full bg-blue-100 text-blue-700 text-sm font-sans font-normal py-2 px-3 rounded-md box-border 
          focus:outline-none active:bg-blue-700 active:text-white shadow-lg hover:shadow-none hover:bg-blue-700 hover:text-white relative flex justify-center items-cente"
          onClick={() => updateDevice(device, false)}
          >
            { device.isCheckedOut ? null : <BadgeCheckIcon className="h-5 absolute left-5 mr-3" />}
            <span>check-out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Device;