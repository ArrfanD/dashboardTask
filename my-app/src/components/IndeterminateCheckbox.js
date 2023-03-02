import React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { data } from "../Assets/data";
import { useState } from "react";
import Row from "react-bootstrap/esm/Row";
import arrowRight from "../Assets/icons/arrow-right-line.svg";
import { motion } from 'framer-motion'

export default function IndeterminateCheckbox() {
  // State for all the functionality defining data 
  const [clickedId, setClickedId] = useState([]);
  const [zoneCityObj, setZoneCityObj] = useState([]);
  const [zoneIndex, setZoneIndex] = useState([]);
  const [clickedArea, setClickedArea] = useState([]);

  // This function is called inside the handleWork function to manipulate the "zoneCityObj" state.
  // "zoneCityObj" is the record of all the area checkboxes that are checked & unchecked
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

  // The below handleWork function simply pulls all the respective checked/unchecked area data &
  // calls the setTheMainState function and passes the data into it to set the "zoneCityObj" state
  function handleWork(id, zoneId, area) {
    setZoneIndex(zoneId);
    const isIdAlreadyPresent = clickedId.indexOf(id);
    const newClickedIds = [...clickedId];
    const isZoneIndexAlreadyPresent = zoneIndex.indexOf(zoneId);
    const newZoneIds = [...zoneIndex];
    const isAreaAlreadyPresent = clickedArea.indexOf(area);
    const newClickedAreas = [...clickedArea];
    const newZoneAndCity = [];

    if (
      isIdAlreadyPresent === -1 ||
      isZoneIndexAlreadyPresent === -1 ||
      isAreaAlreadyPresent === -1
    ) {
      newClickedIds.push(id);
      newZoneIds.push(zoneId);
      newClickedAreas.push(area);
      newZoneAndCity.push({ city: id, zone: zoneId, areaName: area });
    } else {
      newClickedIds.splice(isIdAlreadyPresent, 1);
      newZoneIds.splice(isZoneIndexAlreadyPresent, 1);
      newClickedAreas.splice(isAreaAlreadyPresent, 1);
    }
    setClickedId(newClickedIds);
    setZoneIndex(newZoneIds);
    setTheMainState(newZoneAndCity);
  }

  return (
    <Row  className="justify-content-evenly w-100 container-fluid">
      {data.map((item) => {
        const index = item.id;

        // The "indeterminateOrChecked" function below is the brain of the concept. This function outputs an object with the exact data 
        // relating to every city checkbox alongith the information of its "indeterminate" or "checked" state.
        // It also outputs the exact pointers (zone, cityLabel) that relate to the checkbox that should show as checked, unchecked or indeterminate.
        let indeterminateOrChecked = (
          item,
          zoneCityObj,
          cityAreaArr,
          cityId,
          cityName
        ) => {
          // below code fetches the entire data in the form that matches the data present in "zoneCityObj" state.
          let innerData = item.advertisers.map((data) => {
            return { city: data.city_id, areaName: data.area, zone: item.id };
          });

          // below code will compare innerData and zoneCityObj and accumulate those in a since variable "checkedObjects"
          let checkedObjects = innerData.reduce((acc, y) => {
            // first filter out objects of zoneCityObj which match with innerData, 
            // so only the concerned objects are present in matchingObjects below
            let matchingObjects = zoneCityObj.filter(
              (m) => y.city === m.city && y.zone === m.zone
            );

            //now see if there are any objects in zoneCityObj that matched with innerData,
            // basically see if any is checked on the UI.
            if (matchingObjects.length > 0) {
              // since there is some data that is matching as it was selected, push it to accumulator (acc)
              acc.push(matchingObjects);
            }
            // else just return acc
            return acc;
          }, []);

          // this is just to find out the number of areas that are present in any city. 
          // The number of areas will decide after comparing whether the city is checked or indeterminate. 
          let sortByCity = checkedObjects
            .map((zone) =>
              zone.filter((zoneArr) => {
                if (zoneArr.city === cityId) {
                  return true;
                } else {
                  return undefined;
                }
              })
            )
            .filter((it) => it.length > 0);
          let targetCity = sortByCity.map((data) =>
            data.reduce((acc, item) => (acc = item.city), 0)
          )[0];

          // final stage. If "sortByCity" length (no of areas) matches that of "cityAreaArr" taken from the city iteration in the map,
          // whose areas were checked, we conclude that the respective city checkbox is in checked state.
          // If they don't match, its indeterminate.  
          if (
            sortByCity.length > 0 &&
            sortByCity[0]?.length === cityAreaArr?.length
          ) {
            return { zone: item.id, cityLabel: targetCity, message: "checked" };
          } else {
            return {
              zone: item.id,
              cityLabel: targetCity,
              message: "indeterminate",
            };
          }
        };

        return (

          <motion.div whileHover={{
            scale: 0.95,
            transition: { duration: 0.2 },
          }} className="flex-col justify-content-start bg-light mx-2 mb-5 card rounded-4 col-lg-3">
            <label className="col-lg-6 mt-2 col-md-6">{item.name}</label>
            <div className="col-lg-6 flex-col justify-content-evenly col-md-8  m-3">
              {item.advertisers.map((city, indexCity) => {
                let city_id = city.city_id;
                let { zone, cityLabel, message } = indeterminateOrChecked(
                  item,
                  zoneCityObj,
                  city.area,
                  city.city_id,
                  city.city.name
                );

                return (
                  <div className="col-lg-3">
                    <FormControlLabel
                      label={city.city.name}
                      control={
                        <Checkbox
                          // data returned from the "indeterminateOrChecked" function is used to give Boolean depending
                          // upon the outcome of the conditions passed.
                          checked={
                            cityLabel === city_id &&
                            message === "checked" &&
                            zone === item.id
                          }
                          indeterminate={
                            cityLabel === city_id && message === "indeterminate"
                          }
                          name={city.city.name}
                        />
                      }
                    />
                    {city.area.map((areas) => {
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

                            <motion.div whileTap={{ rotateZ : 16 , transition: {duration: 0.2}}}>
                              <FormControlLabel
                                label={areas.area}
                                control={
                                  <Checkbox
                                    onChange={() =>
                                      handleWork(
                                        city.city_id,
                                        item.id,
                                        areas.area
                                      )
                                    }
                                    name={city.city.name}
                                    index={index}
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
        );
      })}
    </Row>
  );
}
