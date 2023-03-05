import React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { data } from "../Assets/data";
import { useState } from "react";
import Row from "react-bootstrap/esm/Row";
import arrowRight from "../Assets/icons/arrow-right-line.svg";
import { motion } from "framer-motion";

export default function IndeterminateCheckbox() {
  // State for all the functionality defining data
  const [clickedId, setClickedId] = useState([]);
  const [zoneCityObj, setZoneCityObj] = useState([]);
  const [zoneIndex, setZoneIndex] = useState([]);
  const [clickedArea, setClickedArea] = useState([]);
  const [clickedCheckbox, setClickedCheckbox] = useState([]);


  function removeDuplicateObjects(array) {
    return array.map((childArray) => {
      const uniqueObjects = [];
  
      childArray.forEach((object) => {
        const existingObjectIndex = uniqueObjects.findIndex(
          (uniqueObject) =>
            uniqueObject.zone === object.zone &&
            uniqueObject.city === object.city &&
            uniqueObject.areaName === object.areaName
        );
  
        if (existingObjectIndex === -1) {
          uniqueObjects.push(object);
        }
      });
  
      return uniqueObjects;
    });
  }
  
  
  
  function groupByZone(arr) {
    const zones = {};
    arr.forEach((subArr) => {
      subArr.forEach((obj) => {
        if (!zones[obj.zone]) {
          zones[obj.zone] = [obj];
        } else {
          zones[obj.zone].push(obj);
        }
      });
    });
    return Object.values(zones);
  }
  

  function setTheMainState(newZoneAndCity) {
    let baseArr = [...zoneCityObj];
    // checking if the newZoneAndCity (Checked Data) is already present in zoneCityObj.
    if (
      zoneCityObj.filter(
        (item) =>
          item.city === newZoneAndCity[0].city &&
          item.zone === newZoneAndCity[0].zone &&
          item.areaName === newZoneAndCity[0].areaName
      ).length
    ) {
      // basically, if newZoneAndCity (Checked Data) is already present, remove it from baseArr. (since its unchecked)
      let filtered = baseArr.filter((item) => {
        return (
          item.city !== newZoneAndCity[0].city ||
          item.zone !== newZoneAndCity[0].zone ||
          item.areaName !== newZoneAndCity[0].areaName
        );
      });
      setZoneCityObj(filtered);
    } else {
      // at this stage, newZoneAndCity (Checked Data) is not present, hence add it to baseArr.
      baseArr.push(...newZoneAndCity);
      // update the "zoneCityObj" with the newly checked data.
      setZoneCityObj(baseArr);
    }
  }



  let setSelectedCheckboxState = (dataToBeSet, sentObj) => {
    let workArr = [...clickedCheckbox]

    let checkIsZonePresent = dataToBeSet?.map(arr => arr.filter(item => item.zone === sentObj[0].zone)).filter(item => item.length > 0)
    // console.log('check is zone present ',checkIsZonePresent.length)

    console.log('end result of the',dataToBeSet)
    console.log('end result of the required onject', checkIsZonePresent.length)
    if (checkIsZonePresent.length > 1){
      let removeTheCheckedZoneData = dataToBeSet?.map(arr => arr.filter(item => item.zone !== sentObj[0].zone)).filter(item => item.length > 0)
      console.log('data after removing the double checked zone checkbox', removeTheCheckedZoneData)
      setClickedCheckbox(removeTheCheckedZoneData)
    }else if (checkIsZonePresent.length === 0) {
      console.log('just tesdt')
      workArr.push(sentObj)
      setClickedCheckbox(workArr)
    }

  };

  let handleZoneChange = (itemObj) => {
    let baseArr = [...clickedCheckbox];
    let processed = itemObj.advertisers.map(item => item.area.map(data => {
      return {zone : itemObj.id, city: item.city_id, areaName: data.area}
    })).reduce((acc, arr) => acc.concat(arr), []);
    // console.log(' processed ', processed)
    baseArr.push(processed);
    setClickedCheckbox(baseArr)
    setSelectedCheckboxState(baseArr, processed);
  };

  let handleCityClick = (cityObj,zoneIdFromBtn) => {
    // console.log('cite btn pressed')
    let baseArr = [...clickedCheckbox];
    // console.log('check city presence zones', zoneIdFromBtn,cityObj.city_id )
    // console.log('city data sent from city checkbox',baseArr)
    console.log('city data sent from city checkbox processed',cityObj.area.map(item => {
      return { zone: zoneIdFromBtn, city: cityObj.city_id, areaName: item.area}
    }))
    let dataToBeSent = cityObj.area.map(item => {
      return { zone: zoneIdFromBtn, city: cityObj.city_id, areaName: item.area }
    });
    // console.log('city data sent from city checkbox processed',baseArr)
    let checkCityPresence = baseArr?.map(item => item?.filter(data => data.zone === zoneIdFromBtn && data.city === cityObj.city_id))
    let baseAmr = []
    let removedCityPresence = baseArr?.map(item => item?.filter(data => data.city !== cityObj.city_id || data.zone !== zoneIdFromBtn))?.filter(data => data.length > 0)
    const presentCityQty = checkCityPresence?.filter(item => item.length > 0)[0]?.length
    // let filtered = baseArr?.filter(item => item)
    console.log('check city already present in the checekded state', presentCityQty)
    console.log('check city presence',baseArr, removedCityPresence, cityObj )
    console.log('citypres', checkCityPresence)
    if (presentCityQty === cityObj?.area?.length){
      console.log('cite is already checked')
      // baseArr.push(...baseAmr)
      setClickedCheckbox(removedCityPresence)

    }  else  {
      console.log('cite is unchecked')
      if(!baseArr.length) {
        console.log('base arr is empty')
        baseArr.push(dataToBeSent)
        setClickedCheckbox(baseArr)
      } else {
        console.log('base arr is not empty')
        let ids = []
        let isZonePresent = baseArr.map(item => item.map(data => {
          if (data.zone === zoneIdFromBtn){
            ids.push(data.zone)
          } else {
            return false
          }
        }))
        console.log('base arr is not empty and its pushed now id', ids)

        if (ids.length !== 0 || ids.length > 2){
          console.log('base arr is not empty and its pushed now amend')
          let zoneArr = [...dataToBeSent]
          let insertNewBaseArrData = baseArr.map(item => item.map((itm, index) => {
            if (itm.zone === zoneIdFromBtn && index === 0){
              console.log('base arr itm', itm)
              console.log('base arr itm datatobesent', zoneArr)
              zoneArr.push(itm)
              item.push(...dataToBeSent)
              // let itmArr = [itm]
              // itmArr.push(...dataToBeSent)
              return item
            } else {
              return null
            }
          }))
          let removeTargetZone = baseArr.map(item => item.filter(data => data.zone !== zoneIdFromBtn))
          let separateTargetZone = baseArr.map(item => item.filter(data => data.zone === zoneIdFromBtn))?.filter(item => item.length> 0)
          let addIntoTargetZone = dataToBeSent.map(item => separateTargetZone.push(item))

          baseArr.push(zoneArr)
          let solutionZoneArr = removeDuplicateObjects(baseArr)
          console.log('done area log state basearr',[solutionZoneArr])
          setClickedCheckbox(solutionZoneArr)
        } else {
          console.log('base arr is not empty and its pushed now idnotpresent, put new array')
          baseArr.push(dataToBeSent)
          setClickedCheckbox(baseArr)
        }
      }

    } 
  }

console.log('done area log state', clickedCheckbox)

  return (
    <Row className="justify-content-evenly w-100 container-fluid">
      {data.map((item) => {
        const index = item.id;
        let zoneState = (itemId,itemArr) => {
          let baseArr = [...clickedCheckbox]
          let sortForZone = baseArr?.map(item => item?.filter(data => data.zone === itemArr.id))?.filter(item => item?.length > 0)
          let checkedZoneCities = new Set(sortForZone[0]?.map(item => item.city))
          const checkedZoneCitiesQty = Array.from(checkedZoneCities).length
          const actualCityQtyForZone = itemArr?.advertisers?.map(item => item.city_id).length
          const checkedZoneId = itemId
          // console.log('observe here sds ',checkedZoneCitiesQty )
          if (actualCityQtyForZone === checkedZoneCitiesQty){
            console.log(`checked zone no `,checkedZoneId )
            return {outcome: 'checked', zone: checkedZoneId}
          } else if (actualCityQtyForZone !== checkedZoneCitiesQty && checkedZoneCitiesQty > 0){
            console.log(`indeterminate zone no `, checkedZoneId)
            return {outcome: 'indeterminate', zone: checkedZoneId}
          } else {
            return false
          }
        }

        return (
          <>
            <FormControlLabel
              label={item.name}
              control={
                <Checkbox
                  // data returned from the "indeterminateOrChecked" function is used to give Boolean depending
                  // upon the outcome of the conditions passed.
                  checked={ zoneState(item.id, item).zone === item.id && zoneState(item.id, item).outcome === 'checked' }
                  indeterminate={zoneState(item.id, item).zone === item.id && zoneState(item.id, item).outcome === 'indeterminate' }
                  name={item.name}
                  onChange={() => handleZoneChange(item, item.id)}
                />
              }
            />
            <motion.div
              whileHover={{
                scale: 0.95,
                transition: { duration: 0.2 },
              }}
              className="flex-col justify-content-start bg-light mx-2 mb-5 card rounded-4 col-lg-3"
            >
              <label className="col-lg-6 mt-2 col-md-6">{item.name}</label>
              <div className="col-lg-6 flex-col justify-content-evenly col-md-8  m-3">
                {item.advertisers.map((city, indexCity) => {
                  let city_id = city.city_id;
                  let setCityState = (cityArr, zoneIdForCity) => {
                    console.log('clicked city ',cityArr.area.length,zoneIdForCity)
                    let areaQtyForCurrentCity = cityArr.area.length;
                    let baseArr = [...clickedCheckbox]
                    let sortClickedCityByZone = baseArr?.map(item => item?.filter(data => data.zone === zoneIdForCity))?.filter(item => item?.length > 0)
                    let sortClickedCityByCityId = sortClickedCityByZone[0]?.filter(item => item.city === cityArr?.city_id)
                    let confirmedCityIdSet = new Set(sortClickedCityByCityId?.map(item => item.city))
                    const confirmedCityId = Array.from(confirmedCityIdSet)
                    let areaQuantityForClickedCity = sortClickedCityByCityId?.map(item => item.areaName)
                    console.log('city data taken from setCityState fucntion', areaQuantityForClickedCity?.length)
                    console.log('clicked city id ', confirmedCityId)

                    if (areaQtyForCurrentCity === areaQuantityForClickedCity?.length){
                      console.log('this city is clicked')
                      return {zone: zoneIdForCity, city: confirmedCityId[0], outcome: 'checked'}
                    } else if (areaQtyForCurrentCity !== areaQuantityForClickedCity?.length && areaQuantityForClickedCity?.length > 0) {
                      console.log('this city was not clicked')
                      return {zone: zoneIdForCity, city: confirmedCityId[0], outcome: 'indeterminate'}
                    } else {
                      return false
                    }
                  }

                  return (
                    <div className="col-lg-3">
                      <FormControlLabel
                        label={city.city.name}
                        control={
                          <Checkbox
                            // data returned from the "indeterminateOrChecked" function is used to give Boolean depending
                            // upon the outcome of the conditions passed.
                            checked={setCityState(city, item.id).outcome === 'checked' && setCityState(city, item.id).zone === item.id && setCityState(city, item.id).city === city.city_id}
                            indeterminate={setCityState(city, item.id).outcome === 'indeterminate' && setCityState(city, item.id).zone === item.id && setCityState(city, item.id).city === city.city_id}
                            name={city.city.name}
                        onChange={()=>handleCityClick(city,item.id)}

                          />
                        }
                      />
                      
                      {city.area.map((areas) => {
                        const baseArray = [...clickedCheckbox];
                         let handleAreaClick = (zoneIdNo, cityIdNo, area) => {
                          let dataToSend = {zone: zoneIdNo, city: cityIdNo, areaName: area.area}
                          console.log('done log', dataToSend)
                          let presentNos = []
                          let checkPresence = baseArray.map(item => item.map(data => {
                            if(data.zone === zoneIdNo && data.city === cityIdNo && data.areaName === area.area){
                              presentNos.push(zoneIdNo)
                            }else {
                              return
                            }
                          }))
                          console.log('done log check presence', presentNos.length)
                          if (presentNos.length > 0){
                            let areaRemoved = baseArray.map(item => item.filter(data => data.zone !== zoneIdNo || data.city !== cityIdNo || data.areaName !== area.area))?.filter(x=> x.length > 0)
                            console.log('area log check presence area is already present',areaRemoved)
                            setClickedCheckbox(areaRemoved)
                          } else if (presentNos.length === 0) {
                            console.log('done not a single area is present')
                            baseArray.push([dataToSend])
                            let finalArray = [...baseArray]
                            let resolvedArray = groupByZone(finalArray)
                            console.log('done resolved array', resolvedArray)
                            setClickedCheckbox(resolvedArray)
                          }

                         }

                        let setAreaState = (areaItemId, areaCityId, areasObj, clickArea) => {
                          console.log('areas ', areasObj,areaItemId, areaCityId)
                          let baseArr = [...clickedCheckbox]
                          
                          let extractSelectedCity = baseArr?.map(item => item?.filter(data => data.zone === areaItemId))?.filter(item => item?.length > 0)[0]?.filter(data => data?.areaName === clickArea)[0]?.areaName

                          return {zone: areaItemId, city: areaCityId, areaName: extractSelectedCity}
                        }
                        return (
                          <div className="mx-2">
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                ml: 2,
                              }}
                            >
                              <img src={arrowRight} alt="arrow" />

                              <motion.div
                                whileTap={{
                                  rotateZ: 16,
                                  transition: { duration: 0.2 },
                                }}
                              >
                                <FormControlLabel
                                  label={areas.area}
                                  control={
                                    <Checkbox

                                      onChange={()=> handleAreaClick(item.id, city.city_id, areas)}
                                      name={city.city.name}
                                      index={index}
                                      checked={setAreaState(item.id, city.city_id, areas, areas.area).zone === item.id && setAreaState(item.id, city.city_id, areas, areas.area).city === city.city_id && setAreaState(item.id, city.city_id, areas, areas.area).areaName === areas.area}
                                    />
                                  }
                                />
                              </motion.div>
                            </Box>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        );
      })}
    </Row>
  );
}
