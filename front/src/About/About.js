import React from "react";
import AdminLayout from "../user/AdminLayout";

import Footer from "../Footer/Footer";

const About = () => {
  return (
    <div>
      <AdminLayout
        title="My Book Shop Web"
        description="Go now!"
        className="container-fluid"
      ></AdminLayout>
      <div className="col-md-6 offset-md-3">
        <h4 className="pt-4 pb-3 text-center">
          MongoDB Express React Node Stack TLCN-MERN-STACK
        </h4>
        <hr />
        <div>
          <h3>Description!!!:</h3>
          <ul className="ml-5">
            <li>Ecormerce Web</li>
            <li>Book Shop Web</li>
          </ul>
        </div>

        <Footer className="container-fluid" />

        {/* <footer className="bg-dark p-2 fixed-bottom">
          <div className="container-fluid text-white">
            <div className="row">
              <div className="col-6">
                <p className="mb-0 ">
                  Copyright &copy; 2020 All Rights Reserved by Vladimir Khoa
                </p>
              </div>
              <div className="col-6 d-flex justify-content-center align-items-center">
                <div className="mr-3">
                  <i className="fab fa-facebook "></i>
                </div>
                <div className="mr-3">
                  <i className="fab fa-linkedin"></i>
                </div>
                <div className="mr-3">
                  <i className="fab fa-dribbble"></i>
                </div>
                <div className="mr-3">
                  <i className="fab fa-instagram"></i>
                </div>
              </div>
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  );
};

export default About;
