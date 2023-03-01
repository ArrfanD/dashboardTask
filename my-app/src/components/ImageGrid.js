import React from "react";
import images from "../Assets/imageArray";
import Row from "react-bootstrap/esm/Row";
import { motion } from "framer-motion";

const ImageGrid = () => {
  return (
    <Row className="align-items-center justify-content-center">
      {images.map((item) => (
        <motion.div whileHover={{ scale: 0.95, transition: { duration: 0.2 } }} className="col-lg-3 my-4 mx-2 col-md-4 col-10 col-sm-10 col-12">
          <img
            loading="lazy"
            className="w-100 h-100"
            key={item.id}
            src={item.url}
          ></img>
        </motion.div>
      ))}
    </Row>
  );
};

export default ImageGrid;
