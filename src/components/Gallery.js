import React, { useState, useEffect, useRef } from "react";
import { Galleria } from "primereact/galleria";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import { Helmet } from "react-helmet";
function Gallery() {
  const [images, setImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetAllGalleryDate();
  }, []);

  const GetAllGalleryDate = () => {
    axios.post(URLS.GetAllGallery, {}, {}).then((res) => {
      if (res.status === 200) {
        setImages(res.data.gallerys);
        setIsLoading(false);
      }
    });
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const galleria = useRef(null);

  const itemTemplate = (item) => {
    return (
      <img
        src={URLS.Base + item.image}
        alt={item.alt}
        style={{ width: "100%", display: "block" }}
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        src={URLS.Base + item.image}
        alt={item.alt}
        style={{ display: "block" }}
      />
    );
  };

  return (
    <>
    <Helmet>
        <meta charSet="utf-8" />
        <title>
        Private Theater for Birthdays & Anniversaries | Carnival Castle
        </title>
        <meta
          name="description"
          content="Looking for a unique celebration venue in Hyderabad? Carnival Castle offers luxury private theaters with Lavish decor & food options for any special occasion."
        />
      </Helmet>

      {isLoading == true ? (
        <>
          <div
            className="text-center"
            style={{
              // background:
              //   "linear-gradient(329deg, rgba(191, 63, 249, 1) 0%, rgba(113, 51, 210, 1) 100%)",
              backgroundColor: 'var(--charcoal-black)',
                            height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div>
            <img src="assets/img/gipss.gif" style={{ height: "300px", color:"white"}}></img>
            <h6 style={{ color:"gold"}}>Loading...</h6>
            </div>
          </div>
        </>
      ) : (
        <>
          <div class="home-page indexsix">
            <Header />
            <main class="main-wrapper">
              <section
                id="parallax"
                className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix lighter-back"
                // style={{ backgroundImage: "url(img/bgss.jpg)" }}
                style={{backgroundColor:"#AD3DF0"}}
              >
                <div className="container-md">
                  <div className="row">
                    <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                      <div className="breadcrumb-wrap text-center">
                        <div className="breadcrumb-title mb-30 dark-text">
                          <h1 style={{ marginTop: "20px"   }}>Gallery</h1>
                        </div>
                        {/* <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                              <a href="/" style={{ color: "white" }}>
                                Home
                              </a>
                            </li>
                            <li
                              className="breadcrumb-item active"
                              aria-current="page"
                            >
                              Gallery
                            </li>
                          </ol>
                        </nav> */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="shop-area pt-2 pb-2 p-relative wow fadeInUp animated lighter-back"
                // className="shop-area pt-5 pb-2 p-relative wow fadeInUp animated"
                data-animation="fadeInUp animated"
                data-delay=".2s"
              >
                {/* <div className="container-md">
                  <div>
                    <Galleria
                      ref={galleria}
                      value={images}
                      numVisible={7}
                      style={{ maxWidth: "850px" }}
                      activeIndex={activeIndex}
                      onItemChange={(e) => setActiveIndex(e.index)}
                      circular
                      fullScreen
                      showItemNavigators
                      showThumbnails={false}
                      item={itemTemplate}
                      thumbnail={thumbnailTemplate}
                    />
                    <div>
                      <div className="row mb-4">
                        {images.map((image, index) => {
                          return (
                            <div
                              className="col-lg-4 col-md-4 mt-3 mb-4"
                              key={index}
                            >
                              <img
                                src={URLS.Base + image.image}
                                alt={image.alt}
                                style={{
                                  cursor: "pointer",
                                  width: "100%",
                                  height: "300px",
                                  borderRadius: "20px",
                                  border : "1px solid #F5E7B6"
                                }}
                                onClick={() => {
                                  setActiveIndex(index);
                                  galleria.current.show();
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>{" "}
                </div> */}
                   <div className="container-md">
                          <div>
                            <Galleria
                              ref={galleria}
                              value={images}
                              numVisible={7}
                              style={{ maxWidth: "850px" }}
                              activeIndex={activeIndex}
                              onItemChange={(e) => setActiveIndex(e.index)}
                              circular
                              fullScreen
                              showItemNavigators
                              showThumbnails={false}
                              item={itemTemplate}
                              thumbnail={thumbnailTemplate}
                            />
                            <div>
                              <div className="row mb-4">
                                {images.map((image, index) => {
                                  return (
                                    <div
                                      className="col-lg-4 col-md-4 mt-3 mb-4"
                                      key={index}
                                    >
                                      <div
                                        className="zoom-container"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          setActiveIndex(index);
                                          galleria.current.show();
                                        }}
                                      >
                                        <img
                                          src={URLS.Base + image.image}
                                          alt={image.alt}
                                          style={{
                                            width: "100%",
                                            height: "300px",
                                            border: "1px solid #F5E7B6",
                                          }}
                                        />
                                        {/* Zoom  */}
                                        <span className="zoom-icon">
                                          <i className="fas fa-search-plus"></i>
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
              </section>
            </main>
            <Footer />
          </div>{" "}
        </>
      )}
    </>
  );
}

export default Gallery;
